const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  txId: String,
  gateway: String,
  amount: Number,
  status: String,
  method: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Transaction', TransactionSchema);
