const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const passport = require("passport");

import { PrismaClient } from "@prisma/client";
import { getName } from "../helper";
import { isAdminAuth, isAuth } from "../middleware/auth";
const prisma = new PrismaClient();

//get all data
router.get("/", async (req: any, res: any) => {
  try {
    const users = await prisma.user.findMany();
    const usersCount = await prisma.user.count();
    return res.status(200).json({
      success: true,
      message: "Data retrieved",
      total: usersCount,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something wrong",
    });
  }
});

//get user data by id
router.get("/id/:id", async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const data = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      success: true,
      data,
      message: "Data retrieved",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something wrong in user retreival by id",
    });
  }
});

//register user
router.post("/register", async (req: any, res: any) => {
  try {
    const { name, email, password, phone } = req.body;
    let existingUser;
    if (email) {
      existingUser = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
    }

    if (name && email && password) {
      if (existingUser) {
        return res.status(401).json({
          success: false,
          message: "User with same email already exists.",
        });
      }

      //encrypt the password
      const encPassword = await bcrypt.hash(password, 10);

      const data = await prisma.user.create({
        data: {
          name,
          email,
          password: encPassword,
        },
      });

      //genertate token
      const token = jwt.sign(
        {
          data,
        },
        process.env.JWTSECRET,
        {
          expiresIn: "2h",
        }
      );

      data.token = token;
      data.password = "";

      return res.status(201).json({
        success: true,
        data: { ...data },
        message: "Account created",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: "Something went wrong.",
    });
  }
});

//login basic user
router.post("/login", async (req: any, res: any) => {
  try {
    //get all data from frontend
    const { email, password } = req.body;
    //validation
    if (email && password) {
      const data = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (data) {
        const pass = await bcrypt.compare(password, data.password);
        console.log(password, data.password, pass);
        if (pass) {
          const token = jwt.sign(
            {
              data,
            },
            process.env.JWTSECRET
          );
          console.log(token);
          data.token = token;
          data.password = "";

          return res.status(201).json({
            success: true,
            data: {
              ...data,
            },
            message: "Login success",
          });
        } else {
          return res.status(400).json({
            success: false,
            // data,
            message: "Invlaid email or password",
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          data,
          message: "No account associated with that email",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: "Something went erong during login",
    });
  }
});

router.get("/getme", isAuth, async (req: any, res: any) => {
  try {
    return res.status(200).json({
      success: true,
      data: { ...req.body.user.data, password: "" },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: "Something went erong during login",
    });
  }
});

module.exports = router;
