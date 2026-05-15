const express = require('express');
const potController = require('../controllers/potController.js');
const authContoller = require('../controllers/authController.js');

const router = express.Router();

router.use(authContoller.protect);

router.route('/').get(potController.getAllPot).post(potController.createPot);

router
  .route('/:id')
  .patch(potController.updatePot)
  .delete(potController.deletePot);

router.route('/:id/deposit').post(potController.depositPot);
router.route('/:id/withdraw').post(potController.withdrawPot);

module.exports = router;
