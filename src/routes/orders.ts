const express = require("express");
const router = express.Router();

import { PrismaClient } from "@prisma/client";
import { isAuth } from "../middleware/auth";
const prisma = new PrismaClient();

//create order
router.post("/", async (req: any, res: any) => {
  try {
    const product = await prisma.orders.create({
      data: {
        ...req.body,
        images: {
          create: req.body.images,
        },
      },
    });
    if (product) {
      return res
        .status(201)
        .json({ success: true, message: "Producted Created", data: req.body });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, data: req.body, error: error });
  }
});

// delete product
router.delete("/:id", async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    if (product) {
      return res
        .status(200)
        .json({ success: true, message: "Product Deleted", product: product });
    } else {
      throw "Product not found";
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error });
  }
});

// update product
router.put("/:id", async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (product) {
      const images = req.body.images;
      console.log("________________________IMAGES________________________");
      console.log(images);
      delete req.body.images;
      const updatedProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...req.body,
          images: {
            upsert: images?.map((image: any) => ({
              where: { id: image.id || undefined },
              update: {
                // productId,
                image: image.image,
              },
              create: {
                // productId,
                image: image.image,
              },
            })),
          },
        },
        include: {
          images: true,
          Category: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      if (updatedProduct) {
        return res.status(200).json({
          success: true,
          message: "Product Updated",
          product: updatedProduct,
        });
      } else {
        throw "something went wrong";
      }
    } else {
      throw "Product not found";
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error });
  }
});

//get all data
router.get("/", async (req: any, res: any) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        Category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "All Products Data",

      data: products,
    });
  } catch (error) {}
});

// get product by categories
router.get("/", async (req: any, res: any) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        Category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "All Products Data",

      data: products,
    });
  } catch (error) {}
});

//search product
router.get("/search", async (req: any, res: any) => {
  try {
    const { query, visibility, pageSize, pageNumber } = req.query;
    const parsedPageSize = parseInt(pageSize) || 10;
    const parsedPageNumber = parseInt(pageNumber) || 1;
    const skip = (parsedPageNumber - 1) * parsedPageSize;
    const whereCondition: any = {
      title: { contains: query || "" },

      visibility:
        visibility === "all"
          ? undefined
          : visibility === "false"
          ? false
          : true,
    };
    console.log(whereCondition);
    const products = await prisma.product.findMany({
      where: whereCondition,
      include: {
        Category: true,
      },
      // take: parsedPageSize,
      // skip: skip,
    });
    const totalProducts = await prisma.product.count({ where: whereCondition });
    if (products) {
      return res.status(200).json({
        success: true,
        message: "Product Fetched",
        totalCount: totalProducts,
        data: products,
      });
    } else throw "xaina";
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
});

//get single product data
router.get("/:id", async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
      include: {
        Category: {
          select: {
            name: true,
            id: true,
          },
        },
        images: true,
      },
    });
    if (product) {
      return res
        .status(200)
        .json({ success: true, message: "Product Fetched", data: product });
    } else {
      throw "Product not found";
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error });
  }
});

module.exports = router;
