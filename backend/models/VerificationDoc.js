
const mongoose = require('mongoose');
const VerificationDocSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['license','id','insurance'], required: true },
  filePath: String,
  expiresAt: Date,
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  notes: String
}, { timestamps: true });
module.exports = mongoose.model('VerificationDoc', VerificationDocSchema);
