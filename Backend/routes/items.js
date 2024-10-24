const express = require('express');
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require('../controllers/items');

const { likeItem, unlikeItem } = require('../controllers/likes'); // Import likeItem and unlikeItem
const auth = require('../middlewares/auth');

const router = express.Router();

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
router.post('/:itemId/like', likeItem);

// Unlike an item
router.delete('/:itemId/like', auth, unlikeItem);

module.exports = router;
