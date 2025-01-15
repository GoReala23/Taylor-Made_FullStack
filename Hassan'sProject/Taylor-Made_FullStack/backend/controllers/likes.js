const Like = require('../models/likes');
const Comment = require('../models/comments');

const likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    if (!itemId || !userId) {
      return res
        .status(400)
        .json({ message: 'Item ID and User ID are required' });
    }

    const existingLike = await Like.findOne({ user: userId, item: itemId });
    if (existingLike) {
      return res.status(400).json({ message: 'Item already liked' });
    }

    // Create a new like
    const like = new Like({ user: userId, item: itemId });
    await like.save();
    res.status(201).json(like);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Unlike an item
const unlikeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId || null;
    if (!itemId) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    const userId = req.user ? req.user.id : null;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('Attempting to unlike item:', itemId, 'with user:', userId);

    const result = await Like.deleteOne({ item: itemId, user: userId });
    console.log('Delete result:', result);

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Item unliked successfully' });
    } else {
      res.status(404).json({ error: 'No like found for this user and item' });
    }
  } catch (error) {
    console.error('Error in unlikeItem:', error.message);
    res
      .status(500)
      .json({ error: 'An error occurred while unliking the item' });
  }
};

const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?.id;

  try {
    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const existingLike = await Like.findOne({
      user: userId,
      comment: commentId,
    });
    if (existingLike) {
      return res.status(400).json({ message: 'Comment already liked' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const like = new Like({
      user: userId,
      comment: commentId,
      item: comment.item,
    });
    await like.save();
    res.status(201).json(like);
  } catch (err) {
    console.error('Error in likeComment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const unlikeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const deletedLike = await Like.findOneAndDelete({
      user: userId,
      comment: commentId,
    });
    if (!deletedLike) {
      return res.status(404).json({ message: 'Like not found' });
    }
    res.json({ message: 'Like deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
module.exports = { likeItem, unlikeItem, likeComment, unlikeComment };
