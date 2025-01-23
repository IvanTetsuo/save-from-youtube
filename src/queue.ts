const Queue = require('bull');

export const videoDownloadingQueue = new Queue('video downloading', process.env.REDIS_CONNECT_URI);