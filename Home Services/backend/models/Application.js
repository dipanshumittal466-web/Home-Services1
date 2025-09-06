
const mongoose = require('mongoose');
const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  tradie: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverLetter: String,
  priceQuote: String,
  status: { type: String, enum: ['sent','accepted','rejected'], default: 'sent' }
}, { timestamps: true });
module.exports = mongoose.model('Application', ApplicationSchema);
