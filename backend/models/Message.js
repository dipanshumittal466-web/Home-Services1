
const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  roomId: String, // jobId or composite
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String
}, { timestamps: true });
module.exports = mongoose.model('Message', MessageSchema);
