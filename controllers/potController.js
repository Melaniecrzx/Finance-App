const Pot = require('../models/potModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

exports.getAllPot = catchAsync(async (req, res, next) => {
  const pots = await Pot.find({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    results: pots.length,
    data: { pots },
  });
});

exports.createPot = catchAsync(async (req, res, next) => {
  const newPot = await Pot.create({ ...req.body, user: req.user._id });
  res.status(201).json({
    status: 'success',
    data: {
      newPot,
    },
  });
});

exports.updatePot = catchAsync(async (req, res, next) => {
  const updatedPot = await Pot.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!updatedPot) return next(new AppError('No pot found with that id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      updatedPot,
    },
  });
});

exports.deletePot = catchAsync(async (req, res, next) => {
  const pot = await Pot.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!pot) {
    return next(new AppError('No transaction found with that id', 400));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.depositPot = catchAsync(async (req, res, next) => {
  const pot = await Pot.findOne({ _id: req.params.id, user: req.user._id });
  if (!pot) {
    return next(new AppError('No pot found with that id', 400));
  }
  const newTotal = pot.total + req.body.amount;
  if (newTotal > pot.target)
    return next(new AppError('Amount exceeds target', 400));
  pot.total = newTotal;
  await pot.save();
  res.status(200).json({
    status: 'success',
    data: { pot },
  });
});

exports.withdrawPot = catchAsync(async (req, res, next) => {
  const pot = await Pot.findOne({ _id: req.params.id, user: req.user._id });
  if (!pot) {
    return next(new AppError('No pot found with that id', 400));
  }
  const newTotal = pot.total - req.body.amount;
  if (newTotal < 0) return next(new AppError('Insufficient funds', 400));
  pot.total = newTotal;
  await pot.save();
  res.status(200).json({
    status: 'success',
    data: { pot },
  });
});
