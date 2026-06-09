const express = require('express');
const router  = express.Router();
const { getDashboardStats, getAnalytics } = require('../controllers/dashboardController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/stats',     verifyToken, authorize('retailer'), getDashboardStats);
router.get('/analytics', verifyToken, authorize('retailer'), getAnalytics);

module.exports = router;
