const fs = require('fs');

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/data.json`),
);

const { transactions } = data;
transactions.forEach((t, i) => {
  t.id = i + 1;
});

exports.checkId = (req, res, next) => {
  if (req.params.id * 1 > transactions.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid idea',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.amount || req.body.recurring === undefined) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing required fields: name, amount or recurring',
    });
  }
  next();
};

exports.getAllTransactions = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: transactions.length,
    data: {
      transactions,
    },
  });
};

exports.getTransaction = (req, res) => {
  const id = req.params.id * 1;
  const transaction = transactions.find((t) => t.id === id);

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      transaction,
    },
  });
};

exports.createTransaction = (req, res) => {
  const newTransaction = req.body;
  transactions.push(newTransaction);
  fs.writeFile(
    `${__dirname}/../dev-data/data/data.json`,
    JSON.stringify(data, null, 2),
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 'error', message: 'Erreur écriture fichier' });
      }

      res.status(201).json({
        status: 'success',
        requestAt: req.requestTime,
        data: { transaction: newTransaction },
      });
    },
  );
};

exports.updateTransaction = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    requestAt: req.requestTime,
    data: '<Updated transaction here...',
  });
};

exports.deleteTransaction = (req, res) => {
  res.status(204).json({
    status: 'sucess',
    requestAt: req.requestTime,
    data: null,
  });
};
