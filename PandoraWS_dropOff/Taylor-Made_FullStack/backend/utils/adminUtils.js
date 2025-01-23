const Item = require('../models/item');

const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const toggleFeatured = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.isFeatured = !item.isFeatured;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling featured status', error });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Item.find({ isFeatured: true });
    res.json(featuredProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching featured products', error });
  }
};

module.exports = {
  adminMiddleware,
  toggleFeatured,
  getFeaturedProducts,
};
