const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const express = require('express');

const userSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Wrong email format',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  savedItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          {
            return Promise.reject(new Error('Incorrect email or password'));
          }
        }

        return user;
      });
    });
};

module.exports = mongoose.model('User', userSchema);
