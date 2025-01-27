import { Request, Response } from "express";
import { videoDownloader } from "../../services/VideoDownloader";

export const getResult = async (req: Request, res: Response) => {
    const token = req.query.token;
    const status = await videoDownloader.getJobStatus(token as string);
    return res.json({result: true, status});
};