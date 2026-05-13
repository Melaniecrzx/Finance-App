const mongoose = require('mongoose');
const Transaction = require('../models/transactionModel.js');
const APIFeatures = require('../utils/apiFeatures.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  const searchFilter = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const total = await Transaction.countDocuments({
    user: req.user._id,
    ...searchFilter,
  });
  const features = new APIFeatures(
    Transaction.find({ user: req.user._id, ...searchFilter }),
    req.query,
  )
    .filter()
    .sort()
    .paginate();
  const transactions = await features.query;

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    total,
    data: { transactions },
  });
});
exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return next(new AppError('No transaction found with that id', 400));
  }
  res.status(200).json({
    status: 'success',
    data: {
      transaction,
    },
  });
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  const newTransaction = await Transaction.create({
    ...req.body,
    user: req.user._id,
  });
  if (!newTransaction) {
    return next(new AppError('No transaction found with that id', 400));
  }
  res.status(201).json({
    status: 'success',
    data: {
      newTransaction,
    },
  });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  const updatedTransation = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedTransation,
    },
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);
  if (!transaction) {
    return next(new AppError('No transaction found with that id', 400));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTransactionStats = catchAsync(async (req, res, next) => {
  const stats = await Transaction.aggregate([
    {
      $match: {
        amount: { $lt: 0 },
        user: new mongoose.Types.ObjectId(req.user._id), // ← convertit en ObjectId
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: 1 } },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Transaction.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $group: {
        _id: { $month: '$date' },
        count: { $sum: 1 },
        transactions: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
