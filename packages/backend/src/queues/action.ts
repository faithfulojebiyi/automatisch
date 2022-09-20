import { Queue } from 'bullmq';
import queueErrorHandler from './shared/error-handler';
import redisConnection from './shared/redis-connection';

const actionQueue = new Queue('action', redisConnection);

actionQueue.on('error', queueErrorHandler);

export default actionQueue;
