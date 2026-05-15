const express = require('express');
const billControlller = require('../controllers/billController.js');
const authContoller = require('../controllers/authController.js');

const router = express.Router();
router.use(authContoller.protect);

router.route('/').get(billControlller.getAllBills);

module.exports = router;
