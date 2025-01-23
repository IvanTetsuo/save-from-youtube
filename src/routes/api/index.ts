import { Router } from 'express';
import { addVideoDownloadTask } from './addVideoDownloadTask';
const router = Router();

router.get('/', (req, res) => {
    res.json({result: 'Hello World!'});
});
router.post('/add-video-download-task', addVideoDownloadTask);

export {router as routerApi};