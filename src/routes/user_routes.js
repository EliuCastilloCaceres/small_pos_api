const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');

router.get('/users', ensureToken.ensureToken, userController.getAllUsers);
router.get('/users/:userId',ensureToken.ensureToken, userController.getUserById);

router.post('/users/create',ensureToken.ensureToken, userController.createUser);
router.post('/login', userController.login);

router.put('/users/:userId/update',ensureToken.ensureToken, userController.updateUser);
router.delete('/users/:userId/delete',ensureToken.ensureToken, userController.deleteUser);
module.exports = router;