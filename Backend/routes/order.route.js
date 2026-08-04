const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder} = require("../controllers/order.controller")


router.post("/order", createOrder);
router.get("/order", getOrders);
router.get("/order/:id", getOrderById);
router.delete("/order/:id", deleteOrder);
router.patch("/order/:id", updateOrderStatus);

module.exports = router;