const express = require('express');
const authContoller = require('../controllers/authController.js');

const router = express.Router();

router.post('/signup', authContoller.signup);
router.post('/login', authContoller.login);

module.exports = router;
