const express = require("express");
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/user", createUser); // kept open — registration also exists via /api/auth/register
router.get("/user", protect, authorize("admin"), getUsers);
router.get("/user/:id", protect, getUserById); // controller checks self-or-admin
router.put("/user/:id", protect, updateUser); // controller strips password/role unless admin
router.delete("/user/:id", protect, authorize("admin"), deleteUser);

module.exports = router;