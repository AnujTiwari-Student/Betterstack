import type { Router, Request, Response } from 'express';
import express from 'express';

const router = express.Router();

// GET /api/v1/users - Get all users
router.get('/:id', (req: Request, res: Response) => {
  res.send('Status route is working! ' + req.params.id);
});

export default router;