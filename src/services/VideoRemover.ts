import { JobState } from "bullmq";
import { videoRemovalQueue } from "../queue";
//TODO: переделать на import
const ytdl = require('@distube/ytdl-core');
import fs from "fs";
import path from "path";
import { unlink } from 'node:fs/promises';

class VideoRemover {
    async addRemoveTask(filePath: fs.PathLike): Promise<string> {
        const job = await videoRemovalQueue.add('removeVideo', {filePath}, {delay: 1000 * 60 * 60 * 24});
        if (!job.id) {
            throw new Error('No Job.id');
        }
        return job.id.toString();
    }

    async removeVideo(filePath: fs.PathLike): Promise<boolean> {
        try {
            await unlink(filePath); // file delete
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
        
    }
}

export const videoRemover = new VideoRemover();