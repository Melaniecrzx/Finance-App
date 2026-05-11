const express = require('express');
const potController = require('../controllers/potController.js');

const router = express.Router();

router.route('/').get(potController.getAllPot).post(potController.createPot);

router
  .route('/:id')
  .patch(potController.updatePot)
  .delete(potController.deletePot);

module.exports = router;
