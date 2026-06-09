const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const {
  getAllShops, getShopById,
  createShop, getMyShop, updateShop, deleteShop,
} = require('../controllers/shopController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// ── Multer config ──────────────────────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads', 'shops');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `shop-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (
    allowed.test(path.extname(file.originalname).toLowerCase()) &&
    allowed.test(file.mimetype.split('/')[1])
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed.'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Protected retailer routes (MUST come before /:id wildcard) ──
router.get('/my-shop', verifyToken, authorize('retailer'), getMyShop);
router.post('/',       verifyToken, authorize('retailer'), upload.single('shop_image'), createShop);
router.put('/:id',     verifyToken, authorize('retailer'), upload.single('shop_image'), updateShop);
router.delete('/:id',  verifyToken, authorize('retailer'), deleteShop);

// ── Public routes ────────────────────────────────────────────────
router.get('/',     getAllShops);
router.get('/:id',  getShopById);

module.exports = router;

