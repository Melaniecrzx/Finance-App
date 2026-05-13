const express = require('express');
const transactionController = require('../controllers/transactionController.js');
const authContoller = require('../controllers/authController.js');

const router = express.Router();

router.use(authContoller.protect);

router
  .route('/')
  .get(transactionController.getAllTransactions)
  .post(transactionController.createTransaction);

router
  .route('/transactions-stats')
  .get(transactionController.getTransactionStats);

router.route('/monthly-plan/:year').get(transactionController.getMonthlyPlan);

router
  .route('/:id')
  .get(transactionController.getTransaction)
  .patch(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

module.exports = router;
