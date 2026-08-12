const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } = require("../controllers/order.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/order", protect, createOrder);
router.get("/order", protect, getOrders); // controller scopes non-admins to their own orders
router.get("/order/:id", protect, getOrderById); // controller checks owner-or-admin
router.patch("/order/:id", protect, updateOrderStatus); // controller allows owner-cancel or admin-any-status
router.delete("/order/:id", protect, authorize("admin"), deleteOrder);

module.exports = router;