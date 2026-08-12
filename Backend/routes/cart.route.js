const express = require("express");
const router = express.Router();
const { getCart, addItemToCart, updateCartItem, removeItemFromCart, clearCart } = require("../controllers/cart.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/cart/:userId", protect, addItemToCart);
router.get("/cart/:userId", protect, getCart);
router.patch("/cart/:userId", protect, updateCartItem);
router.delete("/cart/:userId/items/:productId", protect, removeItemFromCart);
router.delete("/cart/:userId", protect, clearCart);

module.exports = router;