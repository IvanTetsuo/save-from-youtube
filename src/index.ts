import 'dotenv/config';
import express from 'express';
import router from './routes';
const app = express();
const port = process.env.PORT || 3000;
import { connectionOptions, videoDownloadingQueue } from './queue';
import { videoDownloader } from './services/VideoDownloader';
import { videoRemover } from './services/VideoRemover';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import  { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import expressBasicAuth from 'express-basic-auth';
import path from 'path';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({
    queues: [new BullMQAdapter(videoDownloadingQueue)],
    serverAdapter: serverAdapter,
});
const dashboardAdmin = process.env.BULLDASHBOARD_CONNECT_USER!;
const dashboardPassword = process.env.BULLDASHBOARD_CONNECT_PASSWORD!;
if (!dashboardAdmin || !dashboardPassword) {
    throw new Error(`Dashboard's username or password is empty`);
}
app.use('/admin/queues',expressBasicAuth({
    users: {[dashboardAdmin]: dashboardPassword},
    challenge: true,
}), serverAdapter.getRouter());

app.use(express.json());
app.use('/', router);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('static'));

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

new Worker ('videos removal', async job => {
    if (!job.id) {
        throw new Error('No Job.id');
    }
    const isRemoved = await videoRemover.removeVideo(job.data.filePath);
    if (!isRemoved) {
        throw new Error('Remove failed');
    }
}, {connection});