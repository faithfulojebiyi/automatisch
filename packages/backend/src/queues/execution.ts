import { Queue } from 'bullmq';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';

const redisConnection = {
  connection: redisConfig,
};
const executionQueue = new Queue('action', redisConnection);

executionQueue.on('error', (err) => {
  if (err) {
    logger.error('err', err);
  }
});

export default executionQueue;
