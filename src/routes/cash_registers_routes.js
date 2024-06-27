const express = require('express');
const router = express.Router();
const cashRegController = require('../controllers/cash_registers_controller.js');
const ensureToken = require('../middlewares/ensureToken.js');
const upload = require('../middlewares/uploadReceiptImage.js');

router.get('/cash-registers/:cashRegisterId/:cashOpenDate/movements',ensureToken.ensureToken,cashRegController.getCashMovements);
router.post('/cash-registers/:cashRegisterId/movements/create',ensureToken.ensureToken,cashRegController.createCashMovement);
router.post('/cash-registers/transactions',ensureToken.ensureToken,cashRegController.getCashTransactions);
router.put('/cash-registers/:cashRegisterId/movements/:cashMovementId/update',ensureToken.ensureToken,cashRegController.updateCashMovement);
router.delete('/cash-registers/:cashRegisterId/movements/:cashMovementId/delete',ensureToken.ensureToken,cashRegController.deleteCashMovement);

router.get('/cash-registers',ensureToken.ensureToken,cashRegController.getAllCashReg);
router.get('/cash-registers/:cashRegisterId/:cashOpenDate/totals',ensureToken.ensureToken,cashRegController.getCashRegTotals);
router.get('/cash-registers/receipt',ensureToken.ensureToken,cashRegController.getReceipt);
router.get('/cash-registers/open',ensureToken.ensureToken,cashRegController.getcashRegsOpen);
router.get('/cash-registers/:cashRegisterId/status/',ensureToken.ensureToken,cashRegController.getCashRegStatusById);
router.post('/cash-registers/create',ensureToken.ensureToken,cashRegController.createCashReg);

router.put('/cash-registers/:cashRegisterId/update',ensureToken.ensureToken,cashRegController.updateCashReg);
router.put('/receipt/update',ensureToken.ensureToken,upload.receiptImgUpload,cashRegController.updateReceipt);
router.delete('/cash-registers/:cashRegisterId/delete',ensureToken.ensureToken,cashRegController.deleteCashReg);

router.post('/cash-registers/:cashRegisterId/open',ensureToken.ensureToken,cashRegController.openCashReg);
router.post('/cash-registers/:cashRegisterId/close',ensureToken.ensureToken,cashRegController.closeCashReg);

module.exports = router;