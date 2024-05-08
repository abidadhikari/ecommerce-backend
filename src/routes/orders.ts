const express = require("express");
const router = express.Router();

import { PrismaClient } from "@prisma/client";
import { isAdminAuth, isAuth } from "../middleware/auth";
const prisma = new PrismaClient();

//create order
router.post("/", isAuth, async (req: any, res: any) => {
  try {
    const orders = await prisma.orders.createMany({
      data: req.body?.map((item: any) => {
        return { ...item, userId: req.body.user.data.id };
      }),
    });
    if (orders) {
      return res
        .status(201)
        .json({ success: true, message: "Order Placed", data: orders });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, data: req.body, error: error });
  }
});

//get all orders
router.get("/all-orders", isAdminAuth, async (req: any, res: any) => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        Product: true,
        User: true,
      },
    });
    if (orders) {
      return res
        .status(200)
        .json({ success: true, message: "All Orders Retrieved", data: orders });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, data: req.body, error: error });
  }
});

//get my orders
router.get("/", isAuth, async (req: any, res: any) => {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        userId: req.body.user.data.id,
      },
      include: {
        Product: true,
        User: true,
      },
    });
    if (orders) {
      return res
        .status(200)
        .json({ success: true, message: "Orders Retrieved", data: orders });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, data: req.body, error: error });
  }
});

//get Single Order
router.get("/single-order/:orderId", async (req: any, res: any) => {
  try {
    const orderId = req.params.orderId;
    const singleOrder = await prisma.orders.findFirst({
      where: {
        id: orderId,
      },
      include: {
        Product: true,
        User: true,
      },
    });
    if (singleOrder) {
      return res.status(200).json({
        success: true,
        message: "Order retrieved",
        data: singleOrder,
      });
    } else {
      throw "Order not found";
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error });
  }
});

//update order
router.put("/single-order/:orderId", async (req: any, res: any) => {
  try {
    const orderId = req.params.orderId;
    const { status, ...rest } = req.body;
    const singleOrder = await prisma.orders.update({
      where: {
        id: orderId,
      },
      data: { status, ...rest },
    });
    if (singleOrder) {
      return res.status(200).json({
        success: true,
        message: "Order updated",
        data: singleOrder,
      });
    } else {
      throw "Order not updated";
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error });
  }
});

//cancel my order / delete
router.delete("/:orderId", async (req: any, res: any) => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await prisma.orders.delete({
      where: {
        id: orderId,
      },
    });
    if (deletedOrder) {
      return res.status(200).json({
        success: true,
        message: "Order Deleted",
        deletedOrder: deletedOrder,
      });
    } else {
      throw "Order not found";
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error });
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

// sales of last 30 days
router.get("/sales-last-30-days", async (req: any, res: any) => {
  try {
    // Get the current date and date 30 days ago
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    // Generate an array of dates for the last 30 days
    const dates = [];
    for (
      let date = new Date(thirtyDaysAgo);
      date <= currentDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }

    // Query the database for sales within the last 30 days
    const sales = await prisma.orders.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo.toISOString(), // Greater than or equal to thirty days ago
          lte: currentDate.toISOString(), // Less than or equal to current date
        },
      },
      orderBy: {
        createdAt: "asc", // Order by creation date ascending
      },
    });

    // Initialize a map to aggregate sales for each date
    const salesMap = new Map();
    dates.forEach((date) => salesMap.set(date.toISOString().split("T")[0], 0));

    // Aggregate sales for each date
    sales.forEach((order) => {
      const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
      salesMap.set(dateKey, salesMap.get(dateKey) + order.orderPrice);
    });

    // Format the data into the desired format
    const formattedData: any = [];
    salesMap.forEach((value, date) => {
      formattedData.push({ value, date });
    });

    // Return the formatted data
    return res.status(200).json({
      success: true,
      message: "sales data fetched",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
