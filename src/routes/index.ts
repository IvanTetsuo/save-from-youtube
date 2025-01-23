import { Router } from 'express';
import { routerApi } from './api';
const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/api', routerApi);

export default router;