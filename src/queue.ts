import Queue from 'bull';

export const videoDownloadingQueue = new Queue('video downloading', {redis: process.env.REDIS_CONNECT_URI});