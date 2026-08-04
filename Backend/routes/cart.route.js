const express = require("express");
const router = express.Router();
const { getCart, addItemToCart, updateCartItem, removeItemFromCart, clearCart} = require("../controllers/cart.controller");

router.post("/cart/:userId", addItemToCart);
router.get("/cart/:userId", getCart);
router.patch("/cart/:userId", updateCartItem);
router.delete("/cart/:userId/items/:productId", removeItemFromCart);
router.delete("/cart/:userId", clearCart);

module.exports = router;