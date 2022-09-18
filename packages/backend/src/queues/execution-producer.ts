import { FlowProducer } from 'bullmq';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';

const executionQueue = new FlowProducer({ connection: redisConfig });

executionQueue.on('error', (err) => {
  if (err) {
    logger.error('err', err);
  }
});

export default executionQueue;
