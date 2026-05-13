const express = require('express');
const budgetController = require('../controllers/budgetController.js');
const authContoller = require('../controllers/authController.js');

const router = express.Router();

router.use(authContoller.protect);

router
  .route('/')
  .get(budgetController.getAllBudgets)
  .post(budgetController.createBudget);

router
  .route('/:id')
  .patch(budgetController.updateBudget)
  .delete(budgetController.deleteBudget);

module.exports = router;
