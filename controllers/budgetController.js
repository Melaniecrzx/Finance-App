const Budget = require('../models/budgetModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

exports.getAllBudgets = catchAsync(async (req, res, next) => {
  const budgets = await Budget.find({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    results: budgets.length,
    data: { budgets },
  });
});

exports.createBudget = catchAsync(async (req, res, next) => {
  const newBudget = await Budget.create({ ...req.body, user: req.user._id });
  res.status(201).json({
    status: 'success',
    data: {
      newBudget,
    },
  });
});

exports.updateBudget = catchAsync(async (req, res, next) => {
  const updatedBudget = await Budget.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    { new: true, runValidators: true },
  );
  if (!updatedBudget)
    return next(new AppError('No budget found with that id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      updatedBudget,
    },
  });
});

exports.deleteBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!budget) {
    return next(new AppError('No transaction found with that id', 400));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
