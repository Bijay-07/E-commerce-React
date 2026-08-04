const express = require("express");
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser} = require("../controllers/user.controller");

router.post("/user", createUser);
router.get("/user", getUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports= router;