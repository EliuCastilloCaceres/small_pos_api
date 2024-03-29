const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');
const upload = require('../middlewares/uploadProductImage.js');

router.get('/users', ensureToken.ensureToken, userController.getAllUsers);
router.get('/users/isauth', ensureToken.ensureToken, userController.isAuth);
router.get('/users/:userId',ensureToken.ensureToken, userController.getUserById);
router.get('/users/:userId/permissions',ensureToken.ensureToken, userController.getPermissionsByUserId);
router.post('/users/:userId/create/permissions',ensureToken.ensureToken, userController.createUserPermissions);
router.post('/users/create',ensureToken.ensureToken, upload.noneUpload, userController.createUser);
router.post('/login', userController.login);

router.put('/users/:userId/update',ensureToken.ensureToken, userController.updateUser);
router.post('/users/:userId/update/permissions',ensureToken.ensureToken, userController.updateUserPermissions);
router.delete('/users/:userId/delete',ensureToken.ensureToken, userController.deleteUser);
module.exports = router;