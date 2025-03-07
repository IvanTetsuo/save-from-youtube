import { JobState } from "bullmq";
import { videoDownloadingQueue } from "../queue";
//TODO: переделать на import
const ytdl = require('@distube/ytdl-core');
import fs from "fs";
import path from "path";
import logger from "../logging/logger";

const parseCookiesStr = (str: string) => {
    return str.split('; ').map((el) => {
        const [name, value] = el.split('=');
        return {name, value};
    });
}

const cookiesStr = process.env.AUTH_YOUTUBE_COOKIES;
if (!cookiesStr) {
    throw new Error('Отсутствует AUTH_YOUTUBE_COOKIES');
}
const cookies = parseCookiesStr(cookiesStr);
logger.info(cookies);
const agentOptions = {
    pipelining: 5,
    maxRedirections: 0,
    localAddress: "127.0.0.1",
};

const agent = ytdl.createAgent(cookies);

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
                const ytdlUrl = ytdl(url, {agent}); //info
                const ytdlUrlPipe = ytdlUrl.pipe(fileStream);

                fileStream.on('finish', () => {
                    logger.info(`Видео сохранено в: ${filePath}`);
                    resolve(true);
                });
                fileStream.on('error', (err: any) => {
                    logger.error('Ошибка при записи файла:', err);
                    resolve(false);
                });
                ytdlUrl.on('error', (err: any) => {
                    logger.error('Ошибка при скачивании файла:', err);
                    resolve(false);
                });
                ytdlUrl.on('progress', (data: any) => {
                    logger.info(data);
                });
            });
        } catch (err) {
            logger.error(err);
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