import { Request, Response } from "express";
import { videoDownloader } from "../services/VideoDownloader";
import fs from "fs";
import { videoRemover } from "../services/VideoRemover";

export const downloadVideo = async (req: Request, res: Response) => {
    const token = req.params.token;
    const filePath = videoDownloader.getVideoFilePath(token);
    const fileStream = fs.createReadStream(filePath);
    // res.setHeader('Content-Length', report.length);
    res.setHeader('Content-disposition', `attachment; filename=${token}_video.mp4`);
    fileStream.on('end', async () => {
        console.log('File downloaded'); // тут должно быть добавление в очередь на удаление
        await videoRemover.addRemoveTask(filePath);
    });
    fileStream.pipe(res);
}