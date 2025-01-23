import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.json({result: 'Hello World!'});
});

export {router as routerApi};