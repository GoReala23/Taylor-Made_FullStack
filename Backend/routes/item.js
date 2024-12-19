const express = require('express');
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require('../controllers/item');
// const adminMiddleware = require('../middlewares/admin');
const { likeItem, unlikeItem } = require('../controllers/likes');
const auth = require('../middlewares/auth');
const {
  adminMiddleware,
  toggleFeatured,
  getFeaturedProducts,
} = require('../utils/adminUtils');

const router = express.Router();

// Admin routes

// Get featured products
router.get('/featured', getFeaturedProducts);

// Toggle featured status
router.patch(
  '/:id/featured',
  auth,
  adminMiddleware,
  toggleFeatured,
  async (req, res) => {
    const { id } = req.params;
    try {
      const item = await Item.findById(id);
      if (!item) return res.status(404).send({ message: 'Item not found' });

      item.isFeatured = !item.isFeatured;
      await item.save();
      res.send(item);
    } catch (error) {
      res.status(500).send({ message: 'Error updating item', error });
    }
  }
);

// POST /api/items - Create a new item
router.post('/', createItem);

// GET /api/items - Get all items
router.get('/', getItems);

// GET /api/items/:id - Get a specific item by ID
router.get('/:id', getItemById);

// PUT /api/items/:id - Update a specific item by ID
router.put('/:id', auth, updateItem);

// DELETE /api/items/:id - Delete a specific item by ID
router.delete('/:id', auth, deleteItem);

// Like an item
router.post('/:itemId/like', auth, likeItem);

// Unlike an item
router.delete('/:itemId/like', auth, unlikeItem);

module.exports = router;

// for emergency use only
// router.post('/bulk-create-items', bulkCreateItems);
