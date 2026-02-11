import jwt = require("jsonwebtoken");

const JWT_SECRET = "schemehub_secret_key";

module.exports = (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Expect: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    req.user = {
      userId: decoded.userId,   // 🔥 SAME NAME EVERYWHERE
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
