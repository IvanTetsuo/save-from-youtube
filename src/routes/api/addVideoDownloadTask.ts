import { Request, Response } from "express";
import { videoDownloader } from "../../services/VideoDownloader";

export const addVideoDownloadTask = async (req: Request, res: Response) => {
    const url = req.body.url;
    const token = await videoDownloader.addDownloadTask(url);
    return res.json({result: true, token});
};