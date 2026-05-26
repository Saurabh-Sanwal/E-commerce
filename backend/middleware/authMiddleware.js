import jwt from "jsonwebtoken";
import User from "../models/User.js";

// List of admin emails - only these 3 people can add/edit/delete products
const ADMIN_EMAILS = [
  "saurabh@admin.com",
  "devesh@admin.com",
  "dikshit@admin.com",
];

// ── Verify JWT token ──────────────────────────────────────────────
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// ── Check if user is admin ────────────────────────────────────────
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!ADMIN_EMAILS.includes(req.user.email)) {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }

  next();
};