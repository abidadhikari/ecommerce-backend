const express = require("express");
const router = express.Router();

import { PrismaClient } from "@prisma/client";
import { isAuth } from "../middleware/auth";
const prisma = new PrismaClient();

//get all category list
router.get("/", async (req: any, res: any) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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
      include: {
        products: true,
      },
    });
    return res
      .status(201)
      .json({ success: true, message: "Category Created", data: category });

    // const category=await prisma
  } catch (error: any) {
    return res
      .status(400)
      .json({ success: false, error, message: error?.message });
  }
});

// update category
router.put("/:id", async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const category = await prisma.category.findFirst({
      where: {
        id: productId,
      },
    });
    if (category) {
      const updatedCategory = await prisma.category.update({
        where: {
          id: productId,
        },
        data: req.body,
        include: {
          products: true,
        },
      });
      if (updatedCategory) {
        return res.status(200).json({
          success: true,
          message: "Category Updated",
          category: updatedCategory,
        });
      } else {
        throw "something went wrong";
      }
    } else {
      throw "Category not found";
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error });
  }
});

// delete category
router.delete("/:id", async (req: any, res: any) => {
  try {
    const categoryId = req.params.id;
    const category = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    if (category) {
      return res.status(200).json({
        success: true,
        message: "Category Deleted",
        category: category,
      });
    } else {
      throw "Category not found";
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error });
  }
});

module.exports = router;
