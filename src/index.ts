import 'dotenv/config';
import express from 'express';
import router from './routes';
const app = express();
const port = process.env.PORT || 3000;
import { connectionOptions, videoDownloadingQueue } from './queue';
import { videoDownloader } from './services/VideoDownloader';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import  { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({
    queues: [new BullMQAdapter(videoDownloadingQueue)],
    serverAdapter: serverAdapter,
});
app.use('/admin/queues', serverAdapter.getRouter());
// BASIC AUTH добавить + добавить 1 параметр, чтоб запрашивало в окошке авторизацию (называется challenge)

app.use(express.json());
app.use('/', router);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const connection = new IORedis({
    ...connectionOptions,
    maxRetriesPerRequest: null,
});
new Worker ('videos downloading', async job => {
    if (!job.id) {
        throw new Error('No Job.id');
    }
    const isDownloaded = await videoDownloader.downloadVideo(job.data.url, job.id.toString());
    if (!isDownloaded) {
        throw new Error('Downloading failed');
    }
}, {connection});