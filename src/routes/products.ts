const express = require("express");
const router = express.Router();

import { PrismaClient } from "@prisma/client";
import { isAuth } from "../middleware/auth";
const prisma = new PrismaClient();

//create product
router.post("/", async (req: any, res: any) => {
  try {
    const product = await prisma.product.create({
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
      const updatedProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...req.body,
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

//add product image
router.post("/add-image/:id", async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const addedProductImage = await prisma.productImage.create({
      data: {
        productId: productId,
        image: req.body.image || "noimage",
      },
    });
    if (addedProductImage)
      return res.status(200).json({
        success: true,
        message: "Image added",
        data: addedProductImage,
      });
    else
      return res
        .status(404)
        .json({ success: false, message: "Image not added" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

//get product images
router.get("/get-image/:id", async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const productImages = await prisma.productImage.findMany({
      where: { productId: productId },
      orderBy: {},
    });
    if (productImages)
      return res.status(200).json({
        success: true,
        message: "Image found",
        data: productImages,
      });
    else
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

//delete prodduct image
router.delete("/delete-image/:id", async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await prisma.productImage.delete({
      where: {
        id: productId,
      },
    });
    if (deletedProduct)
      return res.status(200).json({
        success: true,
        message: "Image deleted",
        data: deletedProduct,
      });
    else
      return res
        .status(404)
        .json({ success: false, message: "Image not found to delete" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

//update prodduct image
router.put("/update-image/:id", async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await prisma.productImage.update({
      where: {
        id: productId,
      },
      data: {
        ...req.body,
      },
    });
    if (updatedProduct)
      return res.status(200).json({
        success: true,
        message: "Image updated",
        data: updatedProduct,
      });
    else
      return res
        .status(404)
        .json({ success: false, message: "Image not found to update" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
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

// get products per category
router.get("/products-per-category", async (req: any, res: any) => {
  try {
    // Query the database to retrieve all categories along with their associated products
    const categoriesWithProducts = await prisma.category.findMany({
      include: {
        products: true,
      },
    });

    // Initialize an object to store the counts of products per category
    const productsPerCategory: any = {};

    // Count the number of products for each category
    categoriesWithProducts.forEach((category) => {
      productsPerCategory[category.name] = category.products.length;
    });

    // Return the data in the desired format
    const formattedData = Object.entries(productsPerCategory).map(
      ([name, count]) => ({
        name,
        products: count,
      })
    );

    // Return the formatted data
    return res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching products per category:", error);
    res.status(500).json({ error: "Internal server error" });
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
