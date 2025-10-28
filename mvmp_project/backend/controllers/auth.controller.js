const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpUtil = require('../utils/otp');
const emailUtil = require('../utils/email');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.signup = async (req,res)=>{ try{
  const { name,email,phone,password,role } = req.body;
  if(!email || !password || !name) return res.status(400).json({ error:'Missing fields' });
  const existing = await User.findOne({ email });
  if(existing) return res.status(409).json({ error:'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, passwordHash: hash, role: role || 'customer' });
  res.json({ ok:true, userId: user._id });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.login = async (req,res)=>{ try{
  const { identifier, password } = req.body;
  if(!identifier || !password) return res.status(400).json({ error:'Missing' });
  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
  if(!user) return res.status(401).json({ error:'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ error:'Invalid credentials' });
  const token = jwt.sign({ id:user._id, role:user.role }, JWT_SECRET, { expiresIn:'1h' });
  res.json({ token, user:{ id:user._id, name:user.name, email:user.email, role:user.role } });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.requestOtp = async (req,res)=>{ try{
  const { identifier } = req.body;
  if(!identifier) return res.status(400).json({ error:'Missing identifier' });
  // find user
  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
  if(!user) return res.status(404).json({ error:'No account found' });
  const otp = await otpUtil.createOtp(identifier);
  // send via email if identifier is email
  if(identifier.includes('@')){
    await emailUtil.sendMail({ to: identifier, subject: 'Your MVMP OTP', text: 'Your OTP: ' + otp });
  } else {
    // SMS sending not implemented in demo - log
    console.log('OTP for', identifier, otp);
  }
  res.json({ ok:true, message:'OTP sent' });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.verifyOtp = async (req,res)=>{ try{
  const { identifier, otp } = req.body;
  if(!identifier || !otp) return res.status(400).json({ error:'Missing' });
  const ok = await otpUtil.verifyOtp(identifier, otp);
  if(!ok) return res.status(400).json({ error:'Invalid or expired OTP' });
  // return short-lived token
  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
  const token = jwt.sign({ id:user._id }, JWT_SECRET, { expiresIn:'15m' });
  res.json({ ok:true, token });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.resetPassword = async (req,res)=>{ try{
  const { token, newPassword } = req.body;
  if(!token || !newPassword) return res.status(400).json({ error:'Missing' });
  const payload = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(payload.id);
  if(!user) return res.status(404).json({ error:'User not found' });
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ ok:true });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
