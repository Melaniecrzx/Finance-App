const mongoose = require('mongoose');

const recurringBillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: [true, 'A recurring bill must have an amount'],
  },
  paid: {
    type: Boolean,
  },
});

const RecurringBill = mongoose.model('RecurringBill', recurringBillSchema);

module.exports = RecurringBill;
