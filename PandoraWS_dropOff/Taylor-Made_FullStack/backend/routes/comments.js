const express = require('express');
const {
  addComment,
  getComments,
  deleteComment,
  getCommentById,
  getCommentsByUser,
  getCommentsByItem,
} = require('../controllers/comments');
const auth = require('../middlewares/auth');

const router = express.Router();

// Add a comment (protected route)
router.post('/:itemId/comments', auth, addComment);

// Get all comments for an item (protected route)
router.get('/:itemId/comments', auth, getComments);

// Get a comment by ID (protected route)
router.get('/:itemId/comments/:commentId', auth, getCommentById);

// Get comments by user (protected route)
router.get('/user/:userId', auth, getCommentsByUser);

// Get comments by item (protected route)
router.get('/item/:itemId', auth, getCommentsByItem);

// Delete a comment (protected route)
router.delete('/:itemId/comments/:commentId', auth, deleteComment);

module.exports = router;
