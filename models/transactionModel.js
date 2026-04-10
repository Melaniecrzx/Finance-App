const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'A transaction must have a name'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
  },
  amount: {
    type: Number,
    required: [true, 'A transaction must have an amount'],
  },
  recurring: {
    type: Boolean,
    required: [true, 'A transaction must have a recurring'],
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
