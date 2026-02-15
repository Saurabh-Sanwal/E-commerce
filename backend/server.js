import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json())
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productsRoutes.js"
import  cartRoutes from "./routes/cart.js";
import addressRoutes from './routes/address.js';
import orderRoutes from './routes/order.js';
connectDB();


 app.use(cors());
 app.use('/api/auth',authRoutes );
 app.use("/api/products", productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/order',orderRoutes)
 app.get("/",(req, res)=>{
    res.send("hello backend");
 })


 app.listen(5001, ()=>{
    console.log("server is running in the port 5001");
 })


 