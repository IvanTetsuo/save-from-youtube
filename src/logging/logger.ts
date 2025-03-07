import winston from 'winston';
const {combine, json, timestamp} = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(), 
        json(),
    ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
});

export default logger;