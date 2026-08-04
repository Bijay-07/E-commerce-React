const express = require("express");
const router = express.Router();

const productUpload = require("../middleware/multer");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/product.controller");


router.post(
    "/product",
    productUpload,
    createProduct
);


router.get(
    "/product",
    getProducts
);


router.get(
    "/product/:id",
    getProductById
);


router.put(
    "/product/:id",
    updateProduct
);


router.delete(
    "/product/:id",
    deleteProduct
);


module.exports = router;