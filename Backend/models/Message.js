const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
