const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
exports.createOrder = async (req,res)=>{ try{
  const payload = req.body; // user, items, totalAmount, shippingAddress, paymentMethod
  const order = await Order.create(payload);
  // create placeholder transaction (to be updated on payment webhook)
  const tx = await Transaction.create({ order: order._id, amount: order.totalAmount, status: 'pending', method: order.paymentMethod });
  res.json({ ok:true, order, transaction: tx });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.getOrdersByUser = async (req,res)=>{ try{
  const orders = await Order.find({ user: req.params.userId }).sort({ createdAt:-1 });
  res.json(orders);
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.getOrdersByVendor = async (req,res)=>{ try{
  const orders = await Order.find({ 'items.vendor': req.params.vendorId }).sort({ createdAt:-1 });
  res.json(orders);
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
