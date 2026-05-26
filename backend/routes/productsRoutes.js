import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC - anyone can view products
router.get("/", getProducts);

// ADMIN ONLY - must be logged in AND be an admin email
router.post("/add",          protect, adminOnly, createProduct);
router.put("/update/:id",    protect, adminOnly, updateProduct);
router.delete("/delete/:id", protect, adminOnly, deleteProduct);

export default router;