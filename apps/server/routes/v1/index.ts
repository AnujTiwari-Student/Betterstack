import Router from 'express';
import websiteRouter from './websites';
import statusRouter from './status';

const router = Router();

router.use('/status', statusRouter);
router.use('/website', websiteRouter);

export default router;