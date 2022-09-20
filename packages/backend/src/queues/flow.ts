import process from 'process';
import { Queue, QueueScheduler } from 'bullmq';
import queueErrorHandler from './shared/error-handler';
import redisConnection from './shared/redis-connection';

const flowQueue = new Queue('flow', redisConnection);
const queueScheduler = new QueueScheduler('flow', redisConnection);

process.on('SIGTERM', async () => {
  await queueScheduler.close();
});

flowQueue.on('error', queueErrorHandler);

export default flowQueue;
