const Pot = require('../models/potModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

exports.getAllPot = catchAsync(async (req, res, next) => {
  const pots = await Pot.find();

  res.status(200).json({
    status: 'success',
    results: pots.length,
    data: { pots },
  });
});

exports.createPot = catchAsync(async (req, res, next) => {
  const newPot = await Pot.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newPot,
    },
  });
});

exports.updatePot = catchAsync(async (req, res, next) => {
  const updatedPot = await Pot.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedPot) return next(new AppError('No pot found with that id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      updatedPot,
    },
  });
});

exports.deletePot = catchAsync(async (req, res, next) => {
  const pot = await Pot.findByIdAndDelete(req.params.id);
  if (!pot) {
    return next(new AppError('No transaction found with that id', 400));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
