import mongoose from 'mongoose';

const vendorInventorySchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  sourceProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sourceVendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'out-of-stock', 'discontinued'],
    default: 'active'
  },
  notes: String
}, {
  timestamps: true
});

// Virtual for profit margin
vendorInventorySchema.virtual('profitMargin').get(function() {
  return ((this.sellingPrice - this.purchasePrice) / this.purchasePrice * 100).toFixed(2);
});

// Ensure virtuals are included in JSON
vendorInventorySchema.set('toJSON', { virtuals: true });
vendorInventorySchema.set('toObject', { virtuals: true });

export default mongoose.model('VendorInventory', vendorInventorySchema);
