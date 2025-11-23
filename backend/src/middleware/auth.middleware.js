import { verifyToken } from "../lib/jwt.token.js";
import User from "../models/user.modal.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = verifyToken(token);
    // console.log("Decoded token:", decoded);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Token invalid" });
    }

    const user = await User.findById(decoded.id).select("-password");
    // console.log("Authenticated user:", user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
