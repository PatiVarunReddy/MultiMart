const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, text: true },
  description: { type: String, text: true },
  category: { type: String, index: true },
  price: { type: Number, required: true },
  mrp: Number,
  stock: { type: Number, default: 0 },
  images: [String],
  offers: String,
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
ProductSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Product', ProductSchema);
