const express = require('express');
const {
  likeItem,
  unlikeItem,
  likeComment,
  unlikeComment,
} = require('../controllers/likes');
const auth = require('../middlewares/auth');

const router = express.Router();

// POST /api/likes/:itemId - Like an item
router.post('/:itemId', auth, likeItem);

// DELETE /api/likes/:itemId - Unlike an item
router.delete('/:itemId', auth, unlikeItem);

// POST /api/likes/comments/:commentId - Like a comment
router.post('/comments/:commentId', auth, likeComment);

// DELETE /api/likes/comments/:commentId - Unlike a comment
router.delete('/comments/:commentId', auth, unlikeComment);

module.exports = router;
