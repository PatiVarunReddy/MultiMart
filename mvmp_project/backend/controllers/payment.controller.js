// Stripe example for card payments. For UPI/Razorpay adapt accordingly.
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET || '');
const Transaction = require('../models/Transaction');
exports.createIntent = async (req,res)=>{ try{
  const { amount, currency='inr', metadata } = req.body;
  if(!stripe) return res.status(500).json({ error:'Stripe not configured in demo' });
  const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(amount*100), currency, metadata });
  res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.webhook = async (req,res)=>{ try{
  // handle stripe webhook to update transactions/orders
  res.status(200).send('ok');
}catch(err){ console.error(err); res.status(500).send('err'); }};
