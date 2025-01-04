const mongoose = require('mongoose');
const Comment = require('../models/comments');
const Item = require('../models/item');

const addComment = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const newComment = new Comment({ comment, item: itemId, user: userId });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while adding the comment' });
  }
};
const getComments = async (req, res) => {
  try {
    const { itemId } = req.params;
    const comments = await Comment.find({ item: itemId }).populate(
      'user',
      'name'
    );

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: 'No comments found for this item' });
    }

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }

    const comment = await Comment.findById(commentId).populate('user', 'name');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get comments by user
const getCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const comments = await Comment.find({ user: userId }).populate(
      'item',
      'name'
    );
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get comments by item
const getCommentsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    const comments = await Comment.find({
      item: new mongoose.Types.ObjectId(itemId),
    }).populate('user', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteComment = async (req, res) => {
  console.log('Delete comment function called');
  console.log('Params:', req.params);
  try {
    const { itemId, commentId } = req.params;
    console.log(
      `Attempting to delete comment ${commentId} from item ${itemId}`
    );
    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      item: itemId,
    });

    if (!comment) {
      console.log('Comment not found');
      return res.status(404).json({ message: 'Comment not found' });
    }

    console.log('Comment deleted successfully');
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error in deleteComment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addComment,
  getComments,
  getCommentById,
  deleteComment,
  getCommentsByUser,
  getCommentsByItem,
};
