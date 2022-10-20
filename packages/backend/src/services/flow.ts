import Flow from '../models/flow';
import globalVariable from '../helpers/global-variable';

type ProcessFlowOptions = {
  flowId: string;
  testRun?: boolean;
};

export const processFlow = async (options: ProcessFlowOptions) => {
  const flow = await Flow.query().findById(options.flowId).throwIfNotFound();

  const triggerStep = await flow.getTriggerStep();
  const triggerCommand = await triggerStep.getTriggerCommand();

  const $ = await globalVariable({
    flow,
    connection: await triggerStep.$relatedQuery('connection'),
    app: await triggerStep.getApp(),
    step: triggerStep,
    testRun: options.testRun,
  });

  return await triggerCommand.run($);
};



// function() {
//   try {
//     await triggerCommand.run($);
//   } catch(error) {
//     // error is the same with $.output.error

//     $.output.data // to process whatever has been fetched

//     error // to process the error
//   }
// }