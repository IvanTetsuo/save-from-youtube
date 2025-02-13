import { Request, Response } from "express"
import fs from 'fs';
import path from "path";

export const getDownloadLink = async (req: Request, res: Response) => {
    try {
        const token: string | undefined = req.query.token as string | undefined;
        if (!token) {
            throw new Error('no token');
        }
        const filePath = path.join('./videos', `${token}_video.mp4`);
    } catch(err) {
        console.error("Ошибка при поиске видео:", err);
        return res.status(500).json({ error: "Error" });
    }
}