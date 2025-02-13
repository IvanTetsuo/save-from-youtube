import { Router } from 'express';
import { routerApi } from './api';
import { downloadVideo } from './downloadVideo';
const router = Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.use('/api', routerApi);
router.get('/download-video/:token', downloadVideo);

export default router;