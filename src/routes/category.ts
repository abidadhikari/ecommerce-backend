const express = require("express");
const router = express.Router();

import { PrismaClient } from "@prisma/client";
import { isAuth } from "../middleware/auth";
const prisma = new PrismaClient();

//get all category list
router.get("/", async (req: any, res: any) => {
  try {
    const categories = await prisma.category.findMany();

    res.status(200).json({
      message: "Categories list",

      data: categories,
    });
  } catch (error) {}
});

//create category
router.post("/create", async (req: any, res: any) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      throw { message: "Name is required" };
    }

    const check = await prisma.category.findFirst({ where: { name } });
    if (check) {
      return res.status(400).json({
        success: false,
        message: `Category named "${name}" already exists.`,
      });
    }
    const category = await prisma.category.create({
      data: {
        name,
        image,
      },
    });
    return res.status(201).json({ success: true, data: category });

    // const category=await prisma
  } catch (error: any) {
    return res
      .status(400)
      .json({ success: false, error, message: error?.message });
  }
});

module.exports = router;
