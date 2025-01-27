import { Router } from 'express';
import { addVideoDownloadTask } from './addVideoDownloadTask';
import { getResult } from './getResult';
const router = Router();

router.get('/', (req, res) => {
    res.json({result: 'Hello World!'});
});
router.post('/add-video-download-task', addVideoDownloadTask);
router.get('/get-video-download-result', getResult);

export {router as routerApi};