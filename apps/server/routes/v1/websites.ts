import type { Router, Request, Response } from "express";
import express from "express";
import prisma from "database/client";

const router = express.Router();

router.post("/create_url", async (req: Request, res: Response) => {
  if (!req.body.url) {
    return res.status(410).send("URL is required");
  }
  const url = req.body.url;
  const newWebsite = await prisma.website.create({
    data: {
      url,
      userId: req.body.userId, 
    },
  });
  res.status(201).json(newWebsite);
});

router.get('get_url/:id', (req: Request, res: Response) => {
  res.send('Status route is working! ' + req.params.id);
});

export default router;
