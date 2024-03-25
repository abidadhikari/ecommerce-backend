const express = require("express");
const router = express.Router();

import { PrismaClient } from "@prisma/client";
import { isAuth } from "../middleware/auth";
const prisma = new PrismaClient();

//get all data
router.get("/", async (req: any, res: any) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
    });

    res.status(200).json({
      message: "Hello world form user api",

      data: products,
    });
  } catch (error) {}
});

// get all products with reviews

module.exports = router;
