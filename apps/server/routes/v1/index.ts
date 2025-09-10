import Router from 'express';
import userRouter from './users';
import websiteRouter from './websites';

const router = Router();

router.use('/users', userRouter);
router.use('/website', websiteRouter);

export default router;