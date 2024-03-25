const jwt = require("jsonwebtoken");

export const isAuth = async (req: any, res: any, next: any) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      const token = authorizationHeader.split(" ")[1];
      const data = jwt.verify(token, process.env.JWTSECRET);

      if (data) {
        req.body.isAuth = true;
        req.body.user = data;
      } else {
        req.body.isAuth = false;
      }
    } else {
      // Handle case where Authorization header is missing or doesn't have Bearer token
      console.log(
        "Authorization header is missing or does not contain a Bearer token."
      );
      return res
        .status(401)
        .json({ success: false, message: "User not Authorized" });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const isAdminAuth = async (req: any, res: any, next: any) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      const token = authorizationHeader.split(" ")[1];
      const data = jwt.verify(token, process.env.JWTSECRET);

      if (data && (data.role === "ADMIN" || "SUPERADMIN")) {
        req.body.isAuth = true;
      } else {
        req.body.isAuth = false;
      }
    } else {
      // Handle case where Authorization header is missing or doesn't have Bearer token
      console.log(
        "Authorization header is missing or does not contain a Bearer token."
      );
      return res
        .status(401)
        .json({ success: false, message: "Admin access is required" });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};
