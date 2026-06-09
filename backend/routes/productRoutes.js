const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  addProduct, getMyProducts, getProductById,
  updateProduct, deleteProduct, getInventory, getProductsByShop,
} = require('../controllers/productController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// ── Multer config ──────────────────────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `product-${unique}${path.extname(file.originalname)}`);
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

// ── Public route ────────────────────────────────────────────
router.get('/shop/:shopId', getProductsByShop);

// ── Protected routes (retailer only) ───────────────────────
// NOTE: /inventory MUST come before /:id to avoid route conflict
router.get('/inventory',  verifyToken, authorize('retailer'), getInventory);
router.get('/',           verifyToken, authorize('retailer'), getMyProducts);
router.post('/',          verifyToken, authorize('retailer'), upload.single('product_image'), addProduct);
router.get('/:id',        verifyToken, authorize('retailer'), getProductById);
router.put('/:id',        verifyToken, authorize('retailer'), upload.single('product_image'), updateProduct);
router.delete('/:id',     verifyToken, authorize('retailer'), deleteProduct);

module.exports = router;
