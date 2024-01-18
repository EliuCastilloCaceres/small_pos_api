const express = require('express');
const router = express.Router();
const providersController = require('../controllers/providers_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');
const upload = require('../middlewares/uploadProductImage.js');

router.get('/providers',ensureToken.ensureToken, providersController.getAllProviders);
router.get('/providers/:providerId',ensureToken.ensureToken, providersController.getProviderById);
router.post('/providers/create',ensureToken.ensureToken, upload.noneUpload, providersController.createProvider);
router.put('/providers/update/:providerId',ensureToken.ensureToken, upload.noneUpload, providersController.updateProvider);
router.delete('/providers/delete/:providerId',ensureToken.ensureToken, providersController.deleteProvider);
module.exports = router;