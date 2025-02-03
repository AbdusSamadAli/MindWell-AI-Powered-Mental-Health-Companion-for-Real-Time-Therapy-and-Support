const express = require("express");
const router = express.Router();
const { signup, login, getAllUsers, getUserById } = require("../controller/authController");
const authenticateUser = require('../middlewares/authMiddleware');

router.post("/signup", signup);
router.post("/login", login);

router.get("/users", authenticateUser, getAllUsers); // Protected route
router.get("/api/user/:userId", authenticateUser, getUserById); // Protected route

module.exports = router;
