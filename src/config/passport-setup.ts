const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: keys.cliendID,
      clientSecret: keys.clientSecret,
      scope: ["profile", "email"],
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: any,
      callback: any
    ) => {
      if (profile) {
        const user = await prisma.user.findFirst({
          where: {
            email: profile?.emails[0]?.value,
          },
        });

        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              name: profile?._json?.name,
              password: profile?.id,
              email: profile?._json?.email,
              isGoogleAuthenticated: true,
              isVerified: profile?._json?.email_verified,
            },
          });
        }
        if (!user?.isGoogleAuthenticated) {
          return callback(null, false, {
            message: "Not authenticated with Google",
          });
        }
      }
      callback(null, profile);
    }
  )
);

passport.serializeUser((user: any, callback: any) => {
  callback(null, user);
});

passport.deserializeUser((user: any, callback: any) => {
  callback(null, user);
});
