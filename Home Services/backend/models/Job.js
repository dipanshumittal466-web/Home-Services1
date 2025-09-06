
const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' } ,
  title: String,
  description: String,
  category: String,
  location: String,
  budget: String,
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open','in_progress','completed','cancelled'], default: 'open' }
}, { timestamps: true });
module.exports = mongoose.model('Job', JobSchema);
