import { videoDownloadingQueue } from "../queue";
import Bull from "bull";
//TODO: переделать на import
const ytdl = require('ytdl-core');
import fs from "fs";
import path from "path";


class VideoDownloader {
    async addDownloadTask(url: string): Promise<string> {
        const job = await videoDownloadingQueue.add({url});
        return job.id.toString();
    }

    async downloadVideo(url: string, job_id: string): Promise<boolean> {
        return new Promise((resolve) => {
            if (!ytdl.validateURL(url)){
                resolve(false);
            }
            const filePath = path.join('./videos', `${job_id}_video.mp4`);
            const fileStream = fs.createWriteStream(filePath);
            ytdl(url).pipe(fileStream); //info

            fileStream.on('finish', () => {
                console.log(`Видео сохранено в: ${filePath}`);
                resolve(true);
            });
            fileStream.on('error', (err) => {
                console.error('Ошибка при записи файла:', err);
                resolve(false);
            });
        });
    }

    async getJobStatus(token: string): Promise<Bull.JobStatus | "stuck" | undefined> {
        const job = await videoDownloadingQueue.getJob(token);
        return await job?.getState();
    }
}

export const videoDownloader = new VideoDownloader();