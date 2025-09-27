import type { Router, Request, Response } from "express";
import express from "express";
import prisma from "database/client";
import { authMiddleware } from "../../middlewares/auth_middleware";

const router = express.Router();

router.post("/create_url", authMiddleware, async (req: Request, res: Response) => {
  if (!req.body.url) {
    return res.status(410).send("URL is required");
  }
  const url = req.body.url;
  const newWebsite = await prisma.website.create({
    data: {
      url,
      userId: req.userId!, 
    },
  });
  res.status(201).json(newWebsite);
});

router.get('get_url/:id', authMiddleware, async (req: Request, res: Response) => {

  const websiteId = req.params.id;

  const website = await prisma.website.findFirst({
    where: {
      id: websiteId,
      userId: req.userId,
    },
    include: {
      ticks: {
        take: 1,
        orderBy: [{
          createdAt: 'desc'
        }]
      }
    }
  });

  if (!website) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.status(200).json(website);

});

export default router;
