const express = require("express");
const router = express.Router();
const { getMessages, saveMessage, updateMessage, deleteMessage } = require("../controller/messageController");
const authenticateUser = require("../middlewares/authMiddleware");
router.get("/:userId1/:userId2", authenticateUser, async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await getMessages(userId1, userId2);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

router.post("/sendMessage", authenticateUser, async (req, res) => {
  try {
    const savedMessage = await saveMessage(req.body);
    if (!savedMessage) {
      return res.status(400).json({ message: "Failed to send message" });
    }
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

router.put("/:messageId", authenticateUser, updateMessage);

router.delete("/:id", authenticateUser, deleteMessage);

module.exports = router;

