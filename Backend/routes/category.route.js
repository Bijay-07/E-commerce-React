const express = require("express");
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory}= require("../controllers/category.controller")

router.post("/category", createCategory);
router.get("/category", getCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

module.exports = router;