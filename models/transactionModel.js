const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: 'User',
  },
  avatar: {
    type: String,
    trim: true,

    required: [true, 'A transaction must have an avatar'],
  },
  name: {
    type: String,
    trim: true,

    required: [true, 'A transaction must have a name'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    trim: true,
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
