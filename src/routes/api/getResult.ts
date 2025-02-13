import { Request, Response } from "express";
import { videoDownloader } from "../../services/VideoDownloader";
import { JobState } from "bullmq";

type VideoDownloadingResult = {
    result: boolean,
    status: 'unknown' | JobState,
    downloadVideoUrl?: string,
}

export const getResult = async (req: Request, res: Response) => {
    const token = req.query.token as string;
    const status = await videoDownloader.getJobStatus(token);
    if (!status) {
        return res.status(404).json({error: 'Отсутствует статус у видео'});
    }
    const result: VideoDownloadingResult = {
        result: true,
        status,
    }
    if (status === 'completed') {
        result.downloadVideoUrl = `/download-video/${token}`;
    }
    return res.json(result);
};