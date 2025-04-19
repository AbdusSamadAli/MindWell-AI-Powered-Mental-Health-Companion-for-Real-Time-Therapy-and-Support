const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['doctor', 'patient'],
    required: true,
  },
  specialization: { type: String }, 
  isOnline: { type: Boolean, default: false },
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
