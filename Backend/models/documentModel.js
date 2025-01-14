const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  data: { type: Object, required: true },
});

module.exports = mongoose.model("Document", DocumentSchema);
