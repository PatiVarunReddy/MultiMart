const Product = require('../models/Product');
exports.search = async (req,res)=>{ try{
  const { q, category, min, max, page=1, limit=12 } = req.query;
  const filter = {};
  if(category) filter.category = category;
  if(min || max) filter.price = {};
  if(min) filter.price.$gte = Number(min);
  if(max) filter.price.$lte = Number(max);
  let query = Product.find(filter);
  if(q) query = Product.find({ $text: { $search: q }, ...filter });
  const total = await Product.countDocuments(filter);
  const items = await query.skip((page-1)*limit).limit(Number(limit)).exec();
  res.json({ total, items });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.getById = async (req,res)=>{ try{
  const p = await Product.findById(req.params.id).populate('vendor','name email');
  if(!p) return res.status(404).json({ error:'Not found' });
  res.json(p);
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.create = async (req,res)=>{ try{
  const payload = req.body;
  // vendor should be set from auth in real app
  const p = await Product.create(payload);
  res.json({ ok:true, product:p });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.update = async (req,res)=>{ try{
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json({ ok:true, product:p });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
exports.remove = async (req,res)=>{ try{
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
}catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }};
