const express = require('express');
const overviewController = require('../controllers/overviewController.js');
const authContoller = require('../controllers/authController.js');

const router = express.Router();

router.use(authContoller.protect);

router.route('/').get(overviewController.getOverview);

module.exports = router;
