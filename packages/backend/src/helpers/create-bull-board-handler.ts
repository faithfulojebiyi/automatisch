import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import triggerQueue from '../queues/trigger';
import flowQueue from '../queues/processor';
import executionQueue from '../queues/execution';

const serverAdapter = new ExpressAdapter();

const createBullBoardHandler = async (serverAdapter: ExpressAdapter) => {
  createBullBoard({
    queues: [
      new BullMQAdapter(flowQueue),
      new BullMQAdapter(triggerQueue),
      new BullMQAdapter(executionQueue),
    ],
    serverAdapter: serverAdapter,
  });
};

export { createBullBoardHandler, serverAdapter };
