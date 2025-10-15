// Simple in-memory OTP store for demo (use Redis in prod)
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const store = new Map(); // key -> { hash, expiresAt, identifier }
function generateOtp(){ return Math.floor(100000 + Math.random()*900000).toString(); }
async function createOtp(identifier){ // identifier = email or phone
  const otp = generateOtp();
  const hash = await bcrypt.hash(otp, 10);
  const expiresAt = Date.now() + (1000 * 60 * 10); // 10 min
  store.set(identifier, { hash, expiresAt });
  return otp;
}
async function verifyOtp(identifier, otp){
  const entry = store.get(identifier);
  if(!entry) return false;
  if(Date.now() > entry.expiresAt){ store.delete(identifier); return false; }
  const ok = await bcrypt.compare(otp, entry.hash);
  if(ok) store.delete(identifier);
  return ok;
}
module.exports = { createOtp, verifyOtp };
