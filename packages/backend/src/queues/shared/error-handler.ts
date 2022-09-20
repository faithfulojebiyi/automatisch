import logger from '../../helpers/logger';

const CONNECTION_REFUSED = 'ECONNREFUSED';

const queueErrorHandler = (error: any) => {
  if (error.code === CONNECTION_REFUSED) {
    logger.error(
      'Make sure you have installed Redis and it is running.',
      error
    );
    process.exit();
  }

  if (error) {
    logger.error('err', error);
  }
};

export default queueErrorHandler;
