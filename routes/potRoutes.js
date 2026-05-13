const express = require('express');
const potController = require('../controllers/potController.js');
const authContoller = require('../controllers/authController.js');

const router = express.Router();

router.use(authContoller.protect);

router.route('/').get(potController.getAllPot).post(potController.createBudget);

router
  .route('/:id')
  .patch(potController.updatePot)
  .delete(potController.deletePot);

module.exports = router;
