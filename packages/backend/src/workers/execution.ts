import { Worker, Job } from 'bullmq';

import ExecutionStep from '../models/execution-step';
import executionQueue from '../queues/execution';
import Processor from '../services/processor';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';

export const worker = new Worker(
  'action',
  async (job) => {
    const { data } = job;
    const { flow, step, nextSteps, execution, executionSteps } = data;

    const AppClass = (await import(`../apps/${step.appKey}`)).default;

    const computedParameters = Processor.computeParameters(
      step.parameters || {},
      executionSteps
    );

    step.parameters = computedParameters;

    const appInstance = new AppClass(step.connection, flow, step);

    if (step.key) {
      const command = appInstance.actions[step.key];
      const fetchedActionData = await command.run();
      const newExecutionSteps = {
        ...executionSteps,
        [step.id]: fetchedActionData,
      };

      return {
        flow,
        step,
        nextSteps,
        execution,
        executionSteps: newExecutionSteps,
      };
    }

    throw new Error('The command cannot be found!');
  },
  { connection: redisConfig }
);

worker.on('completed', async (job, returnValue: any) => {
  logger.info(`JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has completed!`);
  const { flow, execution, step, executionSteps, nextSteps } = returnValue;

  const currentExecutionStep = executionSteps[step.id];

  await ExecutionStep.query().insert({
    executionId: execution.id,
    stepId: step.id,
    status: 'success',
    dataIn: step.parameters,
    dataOut: currentExecutionStep,
  });

  const [nextStep, ...newNextSteps] = nextSteps;

  if (nextStep) {
    const nextJobPayload = {
      flow: flow,
      step: nextStep,
      execution,
      // TODO: rename as executionDataSet
      executionSteps,
      nextSteps: newNextSteps,
    };
    await executionQueue.add(nextStep.id, nextJobPayload);
  }
});

worker.on('failed', async (job, err) => {
  logger.info(
    `JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has failed with ${err.message}`
  );
  const { execution, step } = job.data;

  await ExecutionStep.query().insert({
    executionId: execution.id,
    stepId: step.id,
    status: 'failure',
    dataIn: step.parameters,
    dataOut: {},
    errorDetails: { error: err.message as string },
  });
});

process.on('SIGTERM', async () => {
  await worker.close();
});
