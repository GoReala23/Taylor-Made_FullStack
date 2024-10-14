const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'item',
    required: true,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500,
    ref: 'Comment',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('comment', commentSchema);
