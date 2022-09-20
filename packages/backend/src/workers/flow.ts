import { Worker } from 'bullmq';

import executionQueue from '../queues/action';
import Processor from '../services/processor';
import redisConfig from '../config/redis';
import Flow from '../models/flow';
import Execution from '../models/execution';
import logger from '../helpers/logger';

export const flowWorker = new Worker(
  'flow',
  async (job) => {
    const flow = await Flow.query().findById(job.data.flowId).throwIfNotFound();

    const steps = await flow
      .$relatedQuery('steps')
      .withGraphFetched('connection');
    const [triggerStep, ...actionSteps] = steps;
    const processor = new Processor(flow, { testRun: false });
    const initialTriggerData = await processor.getInitialTriggerData(
      triggerStep
    );

    for (const triggerData of initialTriggerData) {
      const execution = await Execution.query().insert({
        flowId: flow.id,
        testRun: false,
        internalId: triggerData.id,
      });

      const triggerExecutionStep = await execution
        .$relatedQuery('executionSteps')
        .insertAndFetch({
          stepId: triggerStep.id,
          status: 'success',
          dataIn: triggerStep.parameters,
          dataOut: triggerData,
        });

      const [firstAction, ...nextActions] = actionSteps;
      const firstExecutionStepJobName = firstAction.id;
      const firstExecutionStepJobPayload = {
        flow: flow,
        step: firstAction,
        execution,
        executionSteps: {
          [triggerStep.id]: triggerExecutionStep,
        },
        nextSteps: nextActions,
      };
      await executionQueue.add(
        firstExecutionStepJobName,
        firstExecutionStepJobPayload
      );
    }

    return true;
  },
  { connection: redisConfig }
);

flowWorker.on('completed', (job) => {
  logger.info(`JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has completed!`);
});

flowWorker.on('failed', (job, err) => {
  logger.info(
    `JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has failed with ${err.message}`
  );
});

process.on('SIGTERM', async () => {
  await flowWorker.close();
});
