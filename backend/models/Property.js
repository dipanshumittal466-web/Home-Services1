const mongoose = require('mongoose');
const PropertySchema = new mongoose.Schema({
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Property', PropertySchema);
