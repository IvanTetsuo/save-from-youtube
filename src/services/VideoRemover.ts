import { videoRemovalQueue } from "../queue";
import fs from "fs";
import { unlink } from 'node:fs/promises';
import logger from "../logging/logger";

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
            logger.error(err);
            return false;
        }
        
    }
}

export const videoRemover = new VideoRemover();