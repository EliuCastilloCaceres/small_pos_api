const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');
const upload = require('../middlewares/uploadProductImage.js');

router.get('/customers',ensureToken.ensureToken,customersController.getAllCustomers);
router.get('/customers/:customerId',ensureToken.ensureToken,customersController.getCustomerById);
router.post('/customers/create',ensureToken.ensureToken,upload.noneUpload,customersController.createCustomer);
router.put('/customers/:customerId/update',ensureToken.ensureToken,customersController.updateCustomer);
router.delete('/customers/:customerId/delete',ensureToken.ensureToken,customersController.deleteCustomer);

module.exports = router;