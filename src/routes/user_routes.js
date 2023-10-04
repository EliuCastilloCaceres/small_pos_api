const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller.js');

router.get('/users', userController.getAllUsers);

module.exports = router;