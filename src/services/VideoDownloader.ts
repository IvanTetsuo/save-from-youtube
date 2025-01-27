import { videoDownloadingQueue } from "../queue";
import Bull from "bull";
//TODO: переделать на import
const ytdl = require('ytdl-core');
import fs from "fs";


class VideoDownloader {
    async addDownloadTask(url: string): Promise<string> {
        const job = await videoDownloadingQueue.add({url});
        return job.id.toString();
    }

    async downloadVideo(url: string, job_id: string): Promise<boolean> {
        // const info = ytdl(url)
        // .pipe(fs.createWriteStream(`${job_id}_video.mp4`));
        // console.log(info);
        return false;
    }

    async getJobStatus(token: string): Promise<Bull.JobStatus | "stuck" | undefined> {
        const job = await videoDownloadingQueue.getJob(token);
        return await job?.getState();
    }
}

export const videoDownloader = new VideoDownloader();