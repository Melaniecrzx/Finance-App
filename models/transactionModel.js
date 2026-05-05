const mongoose = require('mongoose');
const validator = require('validator');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  avatar: {
    type: String,
    trim: true,
    required: [true, 'A transaction must have an avatar'],
    validator: [validator.isURL, 'Transaction avatar must be an url'],
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'A transaction must have a name'],
    maxLength: [
      80,
      'A transaction name must have less or equal than 80 characters',
    ],
    minLength: [
      5,
      'A transaction name must have more or equal than 5 characters',
    ],
    validator: [
      validator.isAlpha,
      'Transaction name must only contain characters',
    ],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    trim: true,
    enum: {
      values: [
        'Entertainment',
        'Bills',
        'Groceries',
        'Dining Out',
        'Transportation',
        'Personal Care',
        'Lifestyle',
        'Shopping',
        'General',
      ],
      message: 'Wrong category',
    },
  },
  amount: {
    type: Number,
    required: [true, 'A transaction must have an amount'],
  },
  recurring: {
    type: Boolean,
    default: false,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
