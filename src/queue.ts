const Queue = require('bull');

export const videoDownloadingQueue = new Queue('video downloading', 'redis://127.0.0.1:6379');