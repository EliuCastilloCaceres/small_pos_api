const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');
const upload = require('../middlewares/uploadProductImage.js');

router.get('/products',ensureToken.ensureToken, productsController.getAllProducts);
router.get('/products/:productId',ensureToken.ensureToken, productsController.getProductById);
router.post('/products/create',ensureToken.ensureToken, upload.productimgupload, productsController.createProduct);
router.put('/products/update/:productId',ensureToken.ensureToken,upload.productimgupload, productsController.updateProduct);
router.put('/products/generalstock/:productId/update',ensureToken.ensureToken, productsController.updateGeneralStock);
router.delete('/products/delete/:productId',ensureToken.ensureToken, productsController.deleteProduct);

router.get('/products/inventory/getAll/:startDate/:endDate/:operationType',ensureToken.ensureToken, productsController.getAllProductInventory);
router.post('/products/inventory/create',ensureToken.ensureToken, productsController.createProductInventory);

router.post('/products/returns/create',ensureToken.ensureToken, productsController.createReturn);
router.post('/products/:productId/returns/:returnId/details/create',ensureToken.ensureToken, productsController.createReturnDetails);
router.put('/products/returns/update/:returnId',ensureToken.ensureToken, productsController.updateReturn);
router.delete('/products/returns/delete/:returnId',ensureToken.ensureToken, productsController.deleteReturn);

router.get('/products/all/sizes',ensureToken.ensureToken,productsController.getAllSizes);
router.get('/products/:productId/sizes',ensureToken.ensureToken,productsController.getSizesByProductId);
router.post('/products/:productId/sizes/create',ensureToken.ensureToken, productsController.createSizeByProductId);
router.put('/products/sizes/:sizeId/update',ensureToken.ensureToken,productsController.updateSizeBySizeId);
router.delete('/products/sizes/:sizeId/delete',ensureToken.ensureToken, productsController.deleteSizeBySizeId);
module.exports = router;