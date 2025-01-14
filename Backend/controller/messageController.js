const MessageModel = require('../models/Message'); // Correct path to the Message model

const saveMessage = async (messageData) => {
  const existingMessage = await MessageModel.findOne({
    text: messageData.text,
    sender: messageData.sender,
    recipients: { $all: messageData.recipients },
  });

  if (!existingMessage) {
    const newMessage = new MessageModel(messageData);
    return await newMessage.save();
  }

  return null; 
};

const getMessages = async (userId1, userId2) => {
  return await MessageModel.find({
    $or: [
      { sender: userId1, recipients: userId2 },
      { sender: userId2, recipients: userId1 },
    ],
  }).sort({ timestamp: 1 });
};

module.exports = { saveMessage, getMessages };
