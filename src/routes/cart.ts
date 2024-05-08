const express = require("express");
const router = express.Router();

import { PrismaClient } from "@prisma/client";
import { isAuth } from "../middleware/auth";
const prisma = new PrismaClient();

//get all category list
router.get("/", isAuth, async (req: any, res: any) => {
  try {
    if (req.body.user) {
      const cart = await prisma.cart.findMany({
        where: {
          userId: req.body.user.data.id,
        },
        include: { product: true },
      });
      res.status(200).json({
        success: true,
        message: "Cart fetched Success",
        data: cart,
        // user: req.body.user.data.id,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cart error",
      error: error,
    });
  }
});

//add or update to cart
router.post("/", isAuth, async (req: any, res: any) => {
  try {
    if (req.body.user) {
      const isItemAvailable = await prisma.cart.findFirst({
        where: {
          productId: req.body.productId,
          userId: req.body.user.data.id,
        },
      });
      if (!isItemAvailable) {
        // create cart row if item is not available for that user
        if (req.body.count <= 0) {
          throw "Invalid Request count";
        }
        const item = await prisma.cart.create({
          data: {
            productId: req.body.productId,
            userId: req.body.user.data.id,
            count: req.body.count,
          },
        });
        console.log("Entered created EXIT");
        if (item) {
          return res.status(200).json({
            success: true,
            message: "Added to Cart",
            data: item,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Cart row create failed",
          });
        }
      } else {
        const cartItem = isItemAvailable;
        // if item is in cart
        if (req.body.count <= 0) {
          //delete code here
          const deleteItem = await prisma.cart.delete({
            where: {
              id: cartItem.id,
            },
          });
          return deleteItem
            ? res
                .status(200)
                .json({ success: true, message: "Removed From Cart" })
            : res
                .status(500)
                .json({ success: false, message: "failed to delete" });
        } else {
          //update count code here

          if (cartItem) {
            const updateItem = await prisma.cart.update({
              where: {
                id: cartItem.id,
              },
              data: {
                count: req.body.count,
              },
            });
            if (updateItem) {
              return res.status(200).json({
                success: true,
                message: "Item in cart updated",
                data: updateItem,
              });
            }
          }
        }
        return res.status(200).json({
          success: true,
          message: "Item already available in cart",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cart error",
      error: error,
    });
  }
});

module.exports = router;
