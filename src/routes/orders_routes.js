const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');

router.get('/orders',ensureToken.ensureToken,ordersController.getAllorders);
router.get('/orders/:orderId',ensureToken.ensureToken,ordersController.getOrderById);
router.post('/orders/create',ensureToken.ensureToken,ordersController.createOrder);
router.put('/orders/update/:orderId',ensureToken.ensureToken,ordersController.updatedOrder);
router.delete('/orders/cancel/:orderId',ensureToken.ensureToken,ordersController.cancelOrder);

router.post('/orders/details/create',ensureToken.ensureToken,ordersController.createOrderDetails);
router.put('/orders/details/update/:orderDetailsId',ensureToken.ensureToken,ordersController.updatedOrderDetails);
router.delete('/orders/details/delete/:orderDetailsId',ensureToken.ensureToken,ordersController.deleteOrderDetails);


module.exports = router;