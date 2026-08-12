const express = require("express");
const router = express.Router();

const productUpload = require("../middleware/multer");
const { protect, authorize } = require("../middleware/auth.middleware");

const { createProduct, getProducts, getProductById, updateProduct, deleteProduct} = require("../controllers/product.controller");

// Public — anyone can browse products
router.get("/product", getProducts);
router.get("/product/:id", getProductById);

// Admin-only — creating/editing/removing catalog items
router.post("/product", protect, authorize("admin"), productUpload, createProduct);
router.put("/product/:id", protect, authorize("admin"), updateProduct);
router.delete("/product/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;