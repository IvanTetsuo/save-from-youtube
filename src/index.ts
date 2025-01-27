import 'dotenv/config';
import express from 'express';
import router from './routes';
const app = express();
const port = process.env.PORT || 3000;
import { videoDownloadingQueue } from './queue';
import { videoDownloader } from './services/VideoDownloader';

app.use(express.json());
app.use('/', router);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

videoDownloadingQueue.process(async (job) => {
    const isDownloaded = await videoDownloader.downloadVideo(job.data.url, job.id.toString());
    if (!isDownloaded) {
        throw new Error('Downloading failed');
    }
});