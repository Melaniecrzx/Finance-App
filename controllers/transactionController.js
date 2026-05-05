const Transaction = require('../models/transactionModel.js');
const APIFeatures = require('../utils/apiFeatures.js');

exports.getAllTransactions = async (req, res) => {
  try {
    const features = new APIFeatures(Transaction.find(), req.query)
      .filter()
      .sort()
      .paginate();
    const transactions = await features.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const newTransaction = await Transaction.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newTransaction,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTransactionStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { amount: { $lt: 0 } } },
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
