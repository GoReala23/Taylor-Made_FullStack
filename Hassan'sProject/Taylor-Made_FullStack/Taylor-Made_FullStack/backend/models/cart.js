const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      isSavedForLater: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
