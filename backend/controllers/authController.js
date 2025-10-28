import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Otp from '../models/Otp.js';
import generateToken from '../utils/generateToken.js';
import { sendMail } from '../utils/mailer.js';
import { sendSms } from '../utils/sms.js';

import crypto from 'crypto';
import ms from 'ms';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone
    });

    // If vendor, create vendor profile
    if (role === 'vendor') {
      const vendor = await Vendor.create({
        userId: user._id,
        storeName: `${name}'s Store`,
        businessEmail: email,
        businessPhone: phone || ''
      });
      user.vendorId = vendor._id;
      await user.save();
    }

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorId: user.vendorId,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('vendorId');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Request OTP for login (email or phone)
// @route POST /api/auth/request-otp
// @access Public
export const requestOtp = async (req, res) => {
  try {
    const { identifier } = req.body; // can be email or phone (with +country)
    if (!identifier) return res.status(400).json({ success: false, message: 'Identifier required' });

    const isEmail = identifier.includes('@');

    // Only send OTP to real emails (not demo/test emails like example@demo.com) - ensure exists in DB
    if (isEmail) {
      const key = identifier.toLowerCase();
      const user = await User.findOne({ email: identifier });
      if (!user) return res.status(404).json({ success: false, message: 'Email not found' });

      // Check if identifier is blocked
      const lastOtp = await Otp.findOne({ identifier: key }).sort({ createdAt: -1 });
      if (lastOtp && lastOtp.blockedUntil && lastOtp.blockedUntil > new Date()) {
        return res.status(429).json({ success: false, message: 'Too many failed attempts. Try again later.' });
      }

      // Resend cooldown: do not allow a new OTP within 60 seconds of last creation
      if (lastOtp && (Date.now() - new Date(lastOtp.createdAt).getTime()) < 60 * 1000) {
        return res.status(429).json({ success: false, message: 'Please wait before requesting another OTP' });
      }

      // generate OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

      await Otp.create({ identifier: key, code, userId: user._id, type: 'login', expiresAt });

      // send email
      const html = `<p>Your login OTP is <strong>${code}</strong>. It expires in 10 minutes.</p>`;
      const mailResult = await sendMail({ to: identifier, subject: 'Your OTP for Marketplace', html, text: `Your OTP is ${code}` });

      // If mailer did not send because SMTP not configured, log OTP for dev testing
      if (!mailResult) {
        console.warn(`Email OTP for ${identifier}: ${code} (SMTP not configured)`);
      }

      return res.json({ success: true, message: 'OTP sent to email' });
    }

    // Phone-based OTP (only supporting +91 for now)
    const normalized = identifier.startsWith('+') ? identifier : `+${identifier}`;
    // Currently we do not have SMS provider configured. Reject if not +91
    if (!normalized.startsWith('+91')) {
      return res.status(400).json({ success: false, message: 'Only +91 phone numbers are supported at this time' });
    }

    const user = await User.findOne({ phone: normalized });
    if (!user) return res.status(404).json({ success: false, message: 'Phone number not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
    await Otp.create({ identifier: normalized, code, userId: user._id, type: 'login', expiresAt });

    // Try sending via SMS (Twilio) if configured
    const smsResult = await sendSms({ to: normalized, body: `Your login OTP is ${code}. It expires in 10 minutes.` });
    if (!smsResult) {
      console.warn(`SMS OTP for ${normalized}: ${code} (Twilio not configured)`);
    }

    return res.json({ success: true, message: 'OTP generated (sent via SMS in production)' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Verify OTP and login
// @route POST /api/auth/verify-otp
// @access Public
export const verifyOtp = async (req, res) => {
  try {
    const { identifier, code } = req.body;
    if (!identifier || !code) return res.status(400).json({ success: false, message: 'Identifier and code required' });

    const key = identifier.includes('@') ? identifier.toLowerCase() : (identifier.startsWith('+') ? identifier : `+${identifier}`);

    // find most recent OTP record for this identifier
    const otp = await Otp.findOne({ identifier: key }).sort({ createdAt: -1 });
    if (!otp) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    // If blocked due to failed attempts
    if (otp.blockedUntil && otp.blockedUntil > new Date()) {
      return res.status(429).json({ success: false, message: 'Too many failed attempts. Try again later.' });
    }

    // Validate code and expiration
    if (otp.code !== code) {
      otp.attempts = (otp.attempts || 0) + 1;
      // Block after 5 failed attempts for 30 minutes
      if (otp.attempts >= 5) {
        otp.blockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }
      await otp.save();
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (otp.expiresAt && otp.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    otp.verified = true;
    otp.attempts = 0;
    otp.blockedUntil = null;
    await otp.save();

    // find user
    const user = await User.findById(otp.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, data: { _id: user._id, name: user.name, email: user.email, role: user.role, vendorId: user.vendorId, token: generateToken(user._id) } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
