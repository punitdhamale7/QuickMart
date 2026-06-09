const express = require('express');
const router  = express.Router();
const {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getRetailerOrders,
  updateOrderStatus,
  verifyQrToken
} = require('../controllers/orderController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// All order routes are protected/require login
router.use(verifyToken);

router.post('/',                          createOrder);
router.get('/customer',                   getCustomerOrders);
router.get('/retailer',   authorize('retailer'), getRetailerOrders);
router.get('/verify-qr/:token', authorize('retailer'), verifyQrToken);
router.get('/:id',                        getOrderById);
router.put('/:id/status', authorize('retailer'), updateOrderStatus);

module.exports = router;
