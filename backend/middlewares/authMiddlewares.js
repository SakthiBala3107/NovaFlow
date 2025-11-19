import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ENV } from "../config/env.js";

const AuthMiddleWare = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // If header missing or invalid
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid or expired token" });
  }
};

export default AuthMiddleWare;
