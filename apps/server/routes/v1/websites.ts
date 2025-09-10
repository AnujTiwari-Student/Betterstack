import type { Router, Request, Response } from 'express';
import express from 'express';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  res.send('Status route is working!');
});

export default router;
