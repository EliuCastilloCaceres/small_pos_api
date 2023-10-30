const express = require('express');
const router = express.Router();
const providersController = require('../controllers/providers_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');

router.get('/providers',ensureToken.ensureToken, providersController.getAllProviders);
router.post('/providers/create',ensureToken.ensureToken, providersController.createProvider);
router.put('/providers/update/:providerId',ensureToken.ensureToken, providersController.updateProvider);
router.delete('/providers/delete/:providerId',ensureToken.ensureToken, providersController.deleteProvider);
module.exports = router;