import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env FIRST before anything else
dotenv.config();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Saurabh's Store API is running 🚀", status: "ok" });
});

// Routes
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/address",  addressRoutes);
app.use("/api/order",    orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});