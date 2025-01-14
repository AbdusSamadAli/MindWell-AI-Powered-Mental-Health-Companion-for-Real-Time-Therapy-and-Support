const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/authMiddleware");
const { signup, login, getAllUsers, getUserById } = require("../controller/authController");

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ message: "This is a protected route." });
});

router.get("/api/users", authenticateJWT, getAllUsers);
router.get("/api/user/:userId", authenticateJWT, getUserById);

module.exports = router;
