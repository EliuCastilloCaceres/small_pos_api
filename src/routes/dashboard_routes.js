const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');
const upload = require('../middlewares/uploadReceiptImage.js');

router.get('/dashboard/:date',ensureToken.ensureToken, dashboardController.getDashboardInfo);

module.exports = router