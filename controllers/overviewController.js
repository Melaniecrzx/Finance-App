const mongoose = require('mongoose');

const catchAsync = require('../utils/catchAsync.js');
const Transaction = require('../models/transactionModel.js');

exports.getOverview = catchAsync(async (req, res, next) => {
  const stats = await Transaction.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $group: {
        _id: null,
        balance: { $sum: '$amount' },
        income: { $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] } },
        expenses: { $sum: { $cond: [{ $lt: ['$amount', 0] }, '$amount', 0] } },
      },
    },
  ]);
  const recentTransactions = await Transaction.find({ user: req.user._id })
    .sort('-date')
    .limit(5);

  res.status(200).json({
    status: 'success',
    data: {
      balance: stats[0].balance,
      income: stats[0].income,
      expenses: stats[0].expenses,
      recentTransactions,
    },
  });
});
