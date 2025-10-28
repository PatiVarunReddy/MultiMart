const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number, price: Number, vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  totalAmount: Number,
  shippingAddress: { type: Object },
  paymentMethod: String,
  status: { type: String, enum: ['placed','paid','shipped','delivered','cancelled'], default: 'placed' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
