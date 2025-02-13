import { JobState } from "bullmq";
import { videoDownloadingQueue } from "../queue";
//TODO: переделать на import
const ytdl = require('ytdl-core');
import fs from "fs";
import path from "path";


class VideoDownloader {
    async addDownloadTask(url: string): Promise<string> {
        const job = await videoDownloadingQueue.add('downloadVideo', {url});
        if (!job.id) {
            throw new Error('No Job.id');
        }
        return job.id.toString();
    }

    async downloadVideo(url: string, job_id: string): Promise<boolean | undefined> {
        try {
            return new Promise((resolve) => {
                if (!ytdl.validateURL(url)){
                    resolve(false);
                }
                const filePath = this.getVideoFilePath(job_id);
                const fileStream = fs.createWriteStream(filePath);
                const ytdlUrl = ytdl(url); //info
                const ytdlUrlPipe = ytdlUrl.pipe(fileStream);

                fileStream.on('finish', () => {
                    console.log(`Видео сохранено в: ${filePath}`);
                    resolve(true);
                });
                fileStream.on('error', (err: any) => {
                    console.error('Ошибка при записи файла:', err);
                    resolve(false);
                });
                ytdlUrl.on('error', (err: any) => {
                    console.error('Ошибка при записи файла:', err);
                    resolve(false);
                });
            });
        } catch (err) {
            console.log(err);
        }
    }

    async getJobStatus(token: string): Promise<"unknown" | JobState> {
        const job = await videoDownloadingQueue.getJob(token);
        return await job?.getState();
    }

    getVideoFileName(token: string): string {
        return `${token}_video.mp4`;
    }

    getVideoFilePath(token: string): string {
        return path.join('./videos', this.getVideoFileName(token));
    }
}

export const videoDownloader = new VideoDownloader();