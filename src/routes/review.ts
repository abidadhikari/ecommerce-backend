const express = require("express");
const router = express.Router();

import { PrismaClient } from "@prisma/client";
import { isAuth } from "../middleware/auth";
const prisma = new PrismaClient();

//get all reviews
router.get("/", async (req: any, res: any) => {
  try {
    const products = await prisma.review.findMany();

    return res.status(200).json({
      success: true,

      data: products,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, error, message: error?.message });
  }
});

//add review
router.post("/:id", isAuth, async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const { review, star } = req.body;
    if (!req.body.isAuth) {
      return res
        .status(400)
        .json({ success: false, message: "Authorization failed" });
    }
    const reviewReq = await prisma.review.create({
      data: {
        review,
        star,
        productId: id,
        userId: req.body.user.data.id,
      },
    });
    if (reviewReq) {
      return res.status(200).json({ success: true, data: reviewReq });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "something went wrong" });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, error, message: error?.message });
  }
});

router.get("/get-reviews-of-product/:id", async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const reviews = await prisma.review.findMany({
      where: {
        productId: id,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return res.status(200).json({ success: true, data: reviews });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, error, message: error?.message });
  }
});

module.exports = router;
