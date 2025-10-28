const VendorInventory = require('../models/VendorInventory');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

// @desc    Get vendor's sourced inventory
// @route   GET /api/inventory/my-inventory
// @access  Private (Vendor only)
exports.getMyInventory = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const inventory = await VendorInventory.find({ vendor: vendor._id })
      .populate('sourceProduct', 'name images price')
      .populate('sourceVendor', 'storeName')
      .sort('-createdAt');

    // Calculate total stats
    const stats = {
      totalItems: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + item.totalCost, 0),
      totalQuantity: inventory.reduce((sum, item) => sum + item.quantity, 0),
      activeItems: inventory.filter(item => item.status === 'active').length
    };

    res.json({ success: true, data: inventory, stats });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get products from other vendors (for sourcing)
// @route   GET /api/inventory/browse
// @access  Private (Vendor only)
exports.getBrowseProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    // Get products from other vendors
    const products = await Product.find({ 
      vendor: { $ne: vendor._id },
      isApproved: true,
      stock: { $gt: 0 }
    })
      .populate('vendor', 'storeName businessEmail')
      .populate('category', 'name')
      .sort('-createdAt')
      .limit(100);

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Browse products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Source/Purchase product from another vendor
// @route   POST /api/inventory/source
// @access  Private (Vendor only)
exports.sourceProduct = async (req, res) => {
  try {
    const { productId, quantity, purchasePrice, sellingPrice, notes } = req.body;

    const vendor = await Vendor.findOne({ userId: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    // Get the product
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if vendor is trying to source their own product
    if (product.vendor.toString() === vendor._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot source your own products' 
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock available' 
      });
    }

    // Create inventory entry
    const inventory = await VendorInventory.create({
      vendor: vendor._id,
      sourceProduct: productId,
      sourceVendor: product.vendor,
      quantity,
      purchasePrice,
      sellingPrice,
      totalCost: purchasePrice * quantity,
      notes
    });

    // Populate the created inventory
    await inventory.populate([
      { path: 'sourceProduct', select: 'name images price' },
      { path: 'sourceVendor', select: 'storeName' }
    ]);

    res.status(201).json({ 
      success: true, 
      data: inventory,
      message: 'Product sourced successfully' 
    });
  } catch (error) {
    console.error('Source product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Vendor only)
exports.updateInventory = async (req, res) => {
  try {
    const { quantity, sellingPrice, status, notes } = req.body;

    const vendor = await Vendor.findOne({ userId: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const inventory = await VendorInventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    // Verify ownership
    if (inventory.vendor.toString() !== vendor._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this inventory' 
      });
    }

    // Update fields
    if (quantity !== undefined) inventory.quantity = quantity;
    if (sellingPrice !== undefined) inventory.sellingPrice = sellingPrice;
    if (status !== undefined) inventory.status = status;
    if (notes !== undefined) inventory.notes = notes;

    // Recalculate total cost if quantity changed
    if (quantity !== undefined) {
      inventory.totalCost = inventory.purchasePrice * quantity;
    }

    await inventory.save();

    await inventory.populate([
      { path: 'sourceProduct', select: 'name images price' },
      { path: 'sourceVendor', select: 'storeName' }
    ]);

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Vendor only)
exports.deleteInventory = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const inventory = await VendorInventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    // Verify ownership
    if (inventory.vendor.toString() !== vendor._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this inventory' 
      });
    }

    await inventory.deleteOne();

    res.json({ success: true, message: 'Inventory item deleted' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inventory analytics
// @route   GET /api/inventory/analytics
// @access  Private (Vendor only)
exports.getInventoryAnalytics = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const inventory = await VendorInventory.find({ vendor: vendor._id });

    const analytics = {
      totalInvestment: inventory.reduce((sum, item) => sum + item.totalCost, 0),
      totalPotentialRevenue: inventory.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0),
      totalItems: inventory.length,
      totalQuantity: inventory.reduce((sum, item) => sum + item.quantity, 0),
      activeItems: inventory.filter(item => item.status === 'active').length,
      outOfStockItems: inventory.filter(item => item.status === 'out-of-stock').length,
      averageProfitMargin: inventory.length > 0 
        ? (inventory.reduce((sum, item) => {
            const margin = ((item.sellingPrice - item.purchasePrice) / item.purchasePrice) * 100;
            return sum + margin;
          }, 0) / inventory.length).toFixed(2)
        : 0
    };

    analytics.expectedProfit = analytics.totalPotentialRevenue - analytics.totalInvestment;

    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
