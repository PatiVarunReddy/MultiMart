const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true
  },
  storeDescription: {
    type: String,
    trim: true
  },
  storeLogo: {
    type: String,
    default: ''
  },
  businessEmail: {
    type: String,
    required: true,
    trim: true
  },
  businessPhone: {
    type: String,
    required: true
  },
  gst: {
    type: String,
    trim: true
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  commission: {
    type: Number,
    default: 10 // Platform commission percentage
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  shippingPolicy: {
    type: String
  },
  returnPolicy: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);
