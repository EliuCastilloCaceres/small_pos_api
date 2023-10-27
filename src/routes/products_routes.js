const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');

router.get('/products',ensureToken.ensureToken, productsController.getAllProducts);
router.post('/products/create',ensureToken.ensureToken, productsController.createProduct);
router.put('/products/update/:productId',ensureToken.ensureToken, productsController.updateProduct);
router.delete('/products/delete/:productId',ensureToken.ensureToken, productsController.deleteProduct);

router.post('/products/returns/create',ensureToken.ensureToken, productsController.createReturn);
router.post('/products/:productId/returns/:returnId/details/create',ensureToken.ensureToken, productsController.createReturnDetails);
router.put('/products/returns/update/:returnId',ensureToken.ensureToken, productsController.updateReturn);
router.delete('/products/returns/delete/:returnId',ensureToken.ensureToken, productsController.deleteReturn);


router.get('/products/:productId/sizes',ensureToken.ensureToken, productsController.getSizesByProductId);
router.post('/products/:productId/sizes/create',ensureToken.ensureToken, productsController.createSizeByProductId);
router.put('/products/sizes/:sizeId/update',ensureToken.ensureToken,productsController.updateSizeBySizeId);
router.delete('/products/sizes/:sizeId/delete',ensureToken.ensureToken, productsController.deleteSizeBySizeId);
module.exports = router;