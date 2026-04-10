const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: {
    type: String,
    required: [true, 'A budget must have a category'],
  },
  maximum: {
    type: Number,
  },
  theme: {
    type: String,
  },
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
