const express = require("express");
const router = express.Router();
const { signup, login, getAllUsers, getUserById, getUsersByRole } = require("../controller/authController");
const authenticateUser = require('../middlewares/authMiddleware');

router.post("/signup", signup);
router.post("/login", login);

router.get("/users", authenticateUser, getAllUsers);
router.get("/api/user/:userId", authenticateUser, getUserById);
router.get("/role/:role", getUsersByRole);
module.exports = router;
