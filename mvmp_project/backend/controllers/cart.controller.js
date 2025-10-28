const Cart = require('../models/Cart');
const Product = require('../models/Product');
exports.getCart = async (req,res)=>{ try{
  const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
  res.json(cart || { user: req.params.userId, items: [] });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.updateCart = async (req,res)=>{ try{
  const { items } = req.body;
  let cart = await Cart.findOne({ user: req.params.userId });
  if(!cart) cart = await Cart.create({ user: req.params.userId, items });
  else { cart.items = items; cart.updatedAt = Date.now(); await cart.save(); }
  res.json(cart);
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.clearCart = async (req,res)=>{ try{
  await Cart.findOneAndDelete({ user: req.params.userId });
  res.json({ ok:true });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
