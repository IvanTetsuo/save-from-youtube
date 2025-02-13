import { Router } from 'express';
import { addVideoDownloadTask } from './addVideoDownloadTask';
import { getResult } from './getResult';
import { getDownloadLink } from './getDownloadLink';
import path from 'path';
const router = Router();

router.get('/', (req, res) => {
    res.json({result: 'Hello World!'});
});
router.post('/add-video-download-task', addVideoDownloadTask);
router.get('/get-video-download-result', getResult);
router.get('/get-download-link', getDownloadLink);

export {router as routerApi};