const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//populate data
router.get("/populate", async (req: any, res: any) => {
  try {
    // populate users details

    const pass = await bcrypt.hash("12345678", 10);
    const users = await prisma.user.createMany({
      data: [
        {
          name: "Alice",
          email: "alice@example.com",
          password: pass,
          // age: 25,
        },
        {
          name: "Bob",
          email: "bob@example.com",
          password: pass,
          // age: 30,
        },
        {
          name: "Charlie",
          email: "charlie@example.com",
          password: pass,
          // age: 35,
        },
        {
          name: "David",
          email: "david@example.com",
          password: pass,
          // age: 28,
        },
        {
          name: "Eve",
          email: "eve@example.com",
          password: pass,
          // age: 22,
        },
        {
          name: "Frank",
          email: "frank@example.com",
          password: pass,
          // age: 27,
        },
        {
          name: "Grace",
          email: "grace@example.com",
          password: pass,
          // age: 32,
        },
        {
          name: "Hannah",
          email: "hannah@example.com",
          password: pass,
          // age: 26,
        },
        {
          name: "Isaac",
          email: "isaac@example.com",
          password: pass,
          // age: 29,
        },
        {
          name: "Jack",
          email: "jack@example.com",
          password: pass,
          // age: 31,
        },
        {
          name: "Kelly",
          email: "kelly@example.com",
          password: pass,
          // age: 24,
        },
        {
          name: "Liam",
          email: "liam@example.com",
          password: pass,
          // age: 33,
        },
        {
          name: "Mia",
          email: "mia@example.com",
          password: pass,
          // age: 23,
        },
        {
          name: "Nathan",
          email: "nathan@example.com",
          password: pass,
          // age: 34,
        },
        {
          name: "Olivia",
          email: "olivia@example.com",
          password: pass,
          // age: 27,
        },
        {
          name: "Peter",
          email: "peter@example.com",
          password: pass,
          // age: 29,
        },
        {
          name: "Quinn",
          email: "quinn@example.com",
          password: pass,
          // age: 25,
        },
        {
          name: "Rachel",
          email: "rachel@example.com",
          password: pass,
          // age: 28,
        },
        {
          name: "Simon",
          email: "simon@example.com",
          password: pass,
          // age: 30,
        },
        {
          name: "Tina",
          email: "tina@example.com",
          password: pass,
          // age: 26,
        },
        {
          name: "admin",
          email: "admin@test.com",
          password: pass,
          // age: 26,
          role: "ADMIN",
        },
        {
          name: "superadmin",
          email: "superadmin@test.com",
          // age: 26,
          password: pass,
          role: "SUPERADMIN",
        },
      ],
      skipDuplicates: true,
    });

    const products = await prisma.product.createMany({
      data: [
        {
          title: "Iphone 11",
          price: 100,
          brand: "UNKNOWN",
        },
        {
          title: "Iphone 12",
          price: 100,
          brand: "UNKNOWN",
        },
        {
          title: "Iphone 13",
          price: 100,
          brand: "UNKNOWN",
        },
        {
          title: "Iphone 14",
          price: 9900,
          brand: "UNKNOWN",
        },
        {
          title: "Iphone 14",
          price: 100,
          brand: "UNKNOWN",
        },
      ],
    });

    // if (users.count === 0) {
    //   throw { message: "Error Populating Users" };
    // }

    res.status(200).json({
      success: true,
      message: "Data Populated",
      data: users,
      products: products,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message,
    });
  }
});

router.get("/populate-image", async (req: any, res: any) => {
  try {
    const products = await prisma.productImage.createMany({
      data: [
        {
          productId: "357567a3-7773-4706-aa49-fda92ec12478",
          image:
            "https://static-01.daraz.com.np/p/3766cb4b534f094227ec351655a5f8fd.jpg_100x100.jpg_.webp",
        },
        {
          productId: "357567a3-7773-4706-aa49-fda92ec12478",
          image:
            "https://static-01.daraz.com.np/p/3766cb4b534f094227ec351655a5f8fd.jpg_100x100.jpg_.webp",
        },
        {
          productId: "357567a3-7773-4706-aa49-fda92ec12478",
          image:
            "https://static-01.daraz.com.np/p/3766cb4b534f094227ec351655a5f8fd.jpg_100x100.jpg_.webp",
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Data Populated",
      products: products,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message,
    });
  }
});

//clear all data
router.get("/clear", async (req: any, res: any) => {
  try {
    // clear users details
    const users = await prisma.user.deleteMany();
    const products = await prisma.product.deleteMany();
    // if (users.count === 0) {
    //   throw { message: "Error Deleteing Users" };
    // }

    res.status(200).json({
      success: true,
      message: "Data Deleted",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message,
    });
  }
});

module.exports = router;
