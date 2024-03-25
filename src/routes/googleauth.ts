const express = require("express");
const router = express.Router();
const keys = require("../config/keys");
const passport = require("passport");
const jwt = require("jsonwebtoken");
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Google OAuth login route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: keys.CLIENT_URL,
    failureRedirect: keys.CLIENT_URL_LOGIN,
    // scope: ["email", "profile"],
  })
);

router.get("/login/failed", (req: any, res: any) => {
  return res.status(401).json({
    error: true,
    message: "LOGIN IN FAILURE",
  });
});

router.get("/login/success", async (req: any, res: any) => {
  console.log(req);
  try {
    const myUser = await prisma.user.findFirst({
      where: {
        email: req.user?._json?.email,
      },
    });
    if (myUser && myUser.isGoogleAuthenticated) {
      const token = jwt.sign(
        {
          data: { ...myUser, password: "" },
        },
        process.env.JWTSECRET
      );
      return res.status(200).json({
        success: true,
        message: "Login success",
        data: { ...myUser, password: "", token },
      });
    } else if (myUser && !myUser.isGoogleAuthenticated) {
      return res.statis(400).json({
        status: false,
        message: "Account not associated with google login",
      });
    } else {
      return res.status(403).json({
        error: true,
        message: "Not Authorized",
        user: req.user,
      });
    }
  } catch (error: any) {
    return res.status(403).json({
      error: true,
      message: "Google Login Failed",
    });
  }
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
//logout

router.get("/logout", (req: any, res: any) => {
  req.logout();

  res.status(200).json({ success: true, message: "Logout success" });
});

module.exports = router;
