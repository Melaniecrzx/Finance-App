const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: {
    type: String,
    trim: true,
    required: [true, 'A budget must have a category'],
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
        'Education',
      ],
      message: 'Wrong category',
    },
  },
  maximum: {
    type: Number,
    required: [true, 'A budget must have a maximum'],
  },
  theme: {
    type: String,
    required: [true, 'A budget must have a theme'],
  },
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
