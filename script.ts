import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
const cookieSession = require("cookie-session");
const passport = require("passport");
const session = require("express-session");
// const cookieParser = require("cookie-parser");

const passportSetup = require("./src/config/passport-setup");

dotenv.config();

if (!process.env.SERVER_PORT) {
  process.exit(1);
}

// const PORT: number = parseInt(process.env.PORT as string, 10);
const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(
  session({
    secret: "12345678sjdafkjashdfjkash",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);
// app.use(cookieParser());
app.use(express.json());

app.use("/auth/", require("./src/routes/googleauth"));
app.use("/api/test", require("./src/routes/test"));
app.use("/api/user", require("./src/routes/user"));
app.use("/api/cart", require("./src/routes/cart"));
app.use("/api/products", require("./src/routes/products"));
app.use("/api/category", require("./src/routes/category"));
app.use("/api/review", require("./src/routes/review"));

app.get("/", (req: any, res: any) => {
  res.status(200).json({ message: "API FOR ABID ADHIKARI ECOMMERCE" });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
