const Budget = require('../models/budgetModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

exports.getAllBudgets = catchAsync(async (req, res, next) => {
  const budgets = await Budget.find();

  res.status(200).json({
    status: 'success',
    results: budgets.length,
    data: { budgets },
  });
});

exports.createBudget = catchAsync(async (req, res, next) => {
  const newBudget = await Budget.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newBudget,
    },
  });
});

exports.updateBudget = catchAsync(async (req, res, next) => {
  const updatedBudget = await Budget.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedBudget,
    },
  });
});

exports.deleteBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.findByIdAndDelete(req.params.id);
  if (!budget) {
    return next(new AppError('No transaction found with that id', 400));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
