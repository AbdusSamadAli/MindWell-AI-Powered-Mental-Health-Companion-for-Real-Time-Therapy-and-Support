const User = require("../models/User");
const Message = require("../models/Message");
const mongoose = require("mongoose");

const socketHandler = async (io, message, userSocketMap) => {
  try {
    const { sender, recipients, text} = message;

    if (!sender || !recipients || (!text)) {
      throw new Error("Sender, recipient, and either text or file must be provided");
    }

    const senderUser = await User.findById(sender).select("username role");
    if (!senderUser) {
      throw new Error("Sender not found");
    }

    const validRecipients = [];
    for (const recipientId of recipients) {
      const recipientUser = await User.findById(recipientId).select("role");
      if (
        recipientUser &&
        recipientUser.role &&
        recipientUser.role !== senderUser.role
      ) {
        validRecipients.push(recipientId);
      }
    }

    if (validRecipients.length === 0) {
      throw new Error("No valid recipients with opposite role found");
    }

    const newMessage = new Message({
      sender,
      recipients: validRecipients,
      text,
      timestamp: new Date(),
    });
    await newMessage.save();
    const messageData = {
      _id: newMessage._id,
      sender: senderUser._id,
      senderUsername: senderUser.username,
      text,
      recipients: validRecipients,
      timestamp: newMessage.timestamp,
    };

    if (userSocketMap[sender]) {
      io.to(userSocketMap[sender]).emit("messageReceived", messageData);
    }

    validRecipients.forEach((recipient) => {
      if (userSocketMap[recipient]) {
        io.to(userSocketMap[recipient]).emit("messageReceived", messageData);
      }
    });
  } catch (error) {
    console.error("Error processing message:", error.message);
  }
};

const getMessages = async (userId1, userId2) => {
  try {
    const user1 = await User.findById(userId1).select("role");
    const user2 = await User.findById(userId2).select("role");

    if (!user1 || !user2 || user1.role === user2.role) {
      throw new Error("Chat allowed only between Doctor and Patient");
    }
    const messages = await Message.find({
      $or: [
        { sender: userId1, recipients: userId2 },
        { sender: userId2, recipients: userId1 },
      ],
    })
      .sort({ timestamp: 1 })
      .populate("sender", "username");
    return messages.map((msg) => ({
      _id: msg._id,
      sender: msg.sender._id,
      senderUsername: msg.sender.username,
      text: msg.text,
      recipients: msg.recipients,
      timestamp: msg.timestamp,
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid message ID" });
    }
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await message.deleteOne();
    return res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;
    if (!mongoose.isValidObjectId(messageId)) {
      return res.status(400).json({ error: "Invalid message ID" });
    }
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    message.text = text;
    await message.save();
    const updatedMessage = await Message.findById(messageId).populate(
      "sender",
      "username"
    );
    res.status(200).json({
      _id: updatedMessage._id,
      sender: updatedMessage.sender._id,
      senderUsername: updatedMessage.sender.username,
      text: updatedMessage.text,
      recipients: updatedMessage.recipients,
      timestamp: updatedMessage.timestamp,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

const saveMessage = async (messageData) => {
  try {
    const { sender, recipients, text, fileUrl } = messageData;
    const senderUser = await User.findById(sender).select("role username");
    if (!senderUser) {
      throw new Error("Sender not found");
    }
    const validRecipients = [];
    for (const recipientId of recipients) {
      const recipientUser = await User.findById(recipientId).select("role");
      if (
        recipientUser &&
        recipientUser.role &&
        recipientUser.role !== senderUser.role
      ) {
        validRecipients.push(recipientId);
      }
    }
    if (validRecipients.length === 0) {
      throw new Error("No valid recipients with opposite role found");
    }
    const newMessage = new Message({
      sender,
      recipients: validRecipients,
      text,
      timestamp: new Date(),
      senderUsername: senderUser.username,
    });
    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

module.exports = {getMessages,deleteMessage,updateMessage,saveMessage,socketHandler};
