const express = require("express");
const { saveDocument } = require("../controllers/documentController");
const authenticateJWT = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateJWT, saveDocument);

module.exports = router;
