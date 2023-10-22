const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');

router.post('/customers/create',ensureToken.ensureToken,customersController.createCustomer);
router.put('/customers/:customerId/update',ensureToken.ensureToken,customersController.updateCustomer);
router.delete('/customers/:customerId/delete',ensureToken.ensureToken,customersController.deleteCustomer);

module.exports = router;