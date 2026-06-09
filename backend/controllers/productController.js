const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Helper: verify retailer owns the shop
const getRetailerShop = async (retailer_id) => {
  const [shops] = await db.query('SELECT id FROM shops WHERE retailer_id = ?', [retailer_id]);
  return shops.length > 0 ? shops[0] : null;
};

// @desc   Add product  POST /api/products
exports.addProduct = async (req, res) => {
  try {
    const shop = await getRetailerShop(req.user.id);
    if (!shop) return res.status(404).json({ success: false, message: 'Create a shop first.' });

    const { product_name, category, description, unit_type, price, stock_quantity, is_available } = req.body;

    if (!product_name || !category || !unit_type || !price || stock_quantity === undefined) {
      return res.status(400).json({ success: false, message: 'product_name, category, unit_type, price and stock_quantity are required.' });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Price must be a positive number.' });
    }

    const image_path = req.file ? `/uploads/products/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO products
        (shop_id, product_name, category, description, unit_type, price, stock_quantity, product_image, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [shop.id, product_name, category, description || null, unit_type,
       Number(price), Number(stock_quantity), image_path,
       is_available !== undefined ? Boolean(Number(is_available)) : true]
    );

    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Product added!', product: product[0] });
  } catch (err) {
    console.error('addProduct:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Get all products for retailer's shop  GET /api/products
exports.getMyProducts = async (req, res) => {
  try {
    const shop = await getRetailerShop(req.user.id);
    if (!shop) return res.status(404).json({ success: false, message: 'No shop found.' });

    const { search, category, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM products WHERE shop_id = ?';
    const params = [shop.id];

    if (search) { query += ' AND product_name LIKE ?'; params.push(`%${search}%`); }
    if (category) { query += ' AND category = ?'; params.push(category); }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [products] = await db.query(query, params);
    res.status(200).json({
      success: true,
      products,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    console.error('getMyProducts:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Get product by ID  GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.status(200).json({ success: true, product: products[0] });
  } catch (err) {
    console.error('getProductById:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Update product  PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const shop = await getRetailerShop(req.user.id);
    if (!shop) return res.status(404).json({ success: false, message: 'No shop found.' });

    const [products] = await db.query('SELECT * FROM products WHERE id = ? AND shop_id = ?', [req.params.id, shop.id]);
    if (products.length === 0) return res.status(404).json({ success: false, message: 'Product not found or access denied.' });

    const { product_name, category, description, unit_type, price, stock_quantity, is_available } = req.body;

    let image_path = products[0].product_image;
    if (req.file) {
      // Delete old image
      if (image_path) {
        const oldPath = path.join(__dirname, '..', image_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image_path = `/uploads/products/${req.file.filename}`;
    }

    await db.query(
      `UPDATE products SET
        product_name   = COALESCE(?, product_name),
        category       = COALESCE(?, category),
        description    = COALESCE(?, description),
        unit_type      = COALESCE(?, unit_type),
        price          = COALESCE(?, price),
        stock_quantity = COALESCE(?, stock_quantity),
        product_image  = ?,
        is_available   = COALESCE(?, is_available)
       WHERE id = ?`,
      [product_name, category, description, unit_type,
       price ? Number(price) : null,
       stock_quantity !== undefined ? Number(stock_quantity) : null,
       image_path,
       is_available !== undefined ? Boolean(Number(is_available)) : null,
       req.params.id]
    );

    const [updated] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Product updated.', product: updated[0] });
  } catch (err) {
    console.error('updateProduct:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Delete product  DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const shop = await getRetailerShop(req.user.id);
    if (!shop) return res.status(404).json({ success: false, message: 'No shop found.' });

    const [products] = await db.query('SELECT * FROM products WHERE id = ? AND shop_id = ?', [req.params.id, shop.id]);
    if (products.length === 0) return res.status(404).json({ success: false, message: 'Product not found or access denied.' });

    // Delete image file
    if (products[0].product_image) {
      const imgPath = path.join(__dirname, '..', products[0].product_image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    console.error('deleteProduct:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Get inventory summary  GET /api/products/inventory
exports.getInventory = async (req, res) => {
  try {
    const shop = await getRetailerShop(req.user.id);
    if (!shop) return res.status(404).json({ success: false, message: 'No shop found.' });

    const [[summary]] = await db.query(
      `SELECT
        COUNT(*)                                  AS total,
        COALESCE(SUM(is_available = 1), 0)        AS available,
        COALESCE(SUM(is_available = 0), 0)        AS out_of_stock,
        COALESCE(SUM(stock_quantity < 10 AND stock_quantity >= 0), 0) AS low_stock
       FROM products WHERE shop_id = ?`,
      [shop.id]
    );

    const [lowItems] = await db.query(
      `SELECT id, product_name, stock_quantity, unit_type
       FROM products WHERE shop_id = ? AND stock_quantity < 10 ORDER BY stock_quantity ASC`,
      [shop.id]
    );

    res.status(200).json({ success: true, summary, low_stock_items: lowItems });
  } catch (err) {
    console.error('getInventory:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Get products by shop (public)  GET /api/products/shop/:shopId
exports.getProductsByShop = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE shop_id = ? AND is_available = 1';
    const params = [req.params.shopId];

    if (category) { query += ' AND category = ?'; params.push(category); }
    if (search)   { query += ' AND product_name LIKE ?'; params.push(`%${search}%`); }

    query += ' ORDER BY category, product_name';
    const [products] = await db.query(query, params);
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error('getProductsByShop:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
