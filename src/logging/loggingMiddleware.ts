import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    logger.debug('Request Body:', JSON.stringify(req.body));
  }
  if (Object.keys(req.params).length > 0) {
    logger.debug('Request Params:', JSON.stringify(req.params));
  }
  if (Object.keys(req.query).length > 0) {
    logger.debug('Request Query:', JSON.stringify(req.query));
  }
  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
  });

  next();
};

export default loggingMiddleware;