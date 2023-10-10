const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');

router.get('/users', ensureToken.ensureToken, userController.getAllUsers);
router.get('/users/:userId',ensureToken.ensureToken, userController.getUserById);

router.post('/login', userController.login);

module.exports = router;