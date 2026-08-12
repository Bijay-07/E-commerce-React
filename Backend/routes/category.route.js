const express = require("express");
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/category.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Public — anyone can browse categories
router.get("/category", getCategories);
router.get("/category/:id", getCategoryById);

// Admin-only
router.post("/category", protect, authorize("admin"), createCategory);
router.put("/category/:id", protect, authorize("admin"), updateCategory);
router.delete("/category/:id", protect, authorize("admin"), deleteCategory);

module.exports = router;