import Router from 'express';
import websiteRouter from './websites';
import userRouter from './users';

const router = Router();

router.use('/website', websiteRouter);
router.use('/users', userRouter);

export default router;