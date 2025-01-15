const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./user');

const itemSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },

    title: {
      type: String,
      default: '',
    },
    servings: {
      type: Number,
      default: 1,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Accept both relative paths and full URLs
          return /^(\/Images\/|https?:\/\/)/.test(v);
        },
        message: 'Image URL must start with /Images/ or http(s)://',
      },
    },
    categories: {
      type: [String],
      required: true,
      enum: {
        values: ['Featured', 'Sweets', 'Meals', 'Breads', 'Butters', 'Others'],
        message: '{VALUE} is not a valid category',
      },
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: 'At least one category is required',
      },
    },
    comments: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
    isSaved: { type: Boolean, default: false },
    savedQuantity: { type: Number, default: 1 },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('item', itemSchema);
