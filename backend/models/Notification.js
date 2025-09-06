
const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  message: String,
  read: { type: Boolean, default: false },
  meta: Object
}, { timestamps: true });
module.exports = mongoose.model('Notification', NotificationSchema);
