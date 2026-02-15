import express from "express";
import {createProduct, deleteProduct ,getProducts, updateProduct} from "../controllers/productController.js"
const router = express.Router();

router.post('/add', createProduct);
router.get('/', getProducts);
router.put('/update/:id',updateProduct)
router.delete('/delete/:id', deleteProduct)

export default router;