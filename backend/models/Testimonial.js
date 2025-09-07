const mongoose = require('mongoose');
const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  active: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Testimonial', TestimonialSchema);
