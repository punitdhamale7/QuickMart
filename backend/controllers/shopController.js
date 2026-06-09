const db = require('../config/db');

// @desc   Get all shops (public)  GET /api/shops
exports.getAllShops = async (req, res) => {
  try {
    const { search, city } = req.query;
    let query = `SELECT s.*, u.full_name as owner_name,
      (SELECT COUNT(*) FROM products p WHERE p.shop_id = s.id AND p.is_available = 1) as product_count
      FROM shops s
      JOIN users u ON s.retailer_id = u.id
      WHERE 1=1`;
    const params = [];

    if (search) { query += ' AND s.shop_name LIKE ?'; params.push(`%${search}%`); }
    if (city)   { query += ' AND s.city = ?'; params.push(city); }

    query += ' ORDER BY s.created_at DESC';
    const [shops] = await db.query(query, params);
    res.status(200).json({ success: true, shops });
  } catch (err) {
    console.error('getAllShops:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Get single shop by ID (public)  GET /api/shops/:id
exports.getShopById = async (req, res) => {
  try {
    const [shops] = await db.query(
      `SELECT s.*, u.full_name as owner_name
       FROM shops s JOIN users u ON s.retailer_id = u.id
       WHERE s.id = ?`,
      [req.params.id]
    );
    if (shops.length === 0) return res.status(404).json({ success: false, message: 'Shop not found.' });
    res.status(200).json({ success: true, shop: shops[0] });
  } catch (err) {
    console.error('getShopById:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.createShop = async (req, res) => {
  try {
    const retailer_id = req.user.id;

    // One shop per retailer
    const [existing] = await db.query('SELECT id FROM shops WHERE retailer_id = ?', [retailer_id]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'You already have a shop. Please update it instead.' });
    }

    const {
      shop_name, shop_description, address, city, area,
      pincode, gst_number, contact_number, opening_time, closing_time,
    } = req.body;

    if (!shop_name || !address || !city || !area || !pincode || !contact_number || !opening_time || !closing_time) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contact_number)) {
      return res.status(400).json({ success: false, message: 'Contact number must be 10 digits.' });
    }

    const shop_image = req.file ? `/uploads/shops/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO shops
        (retailer_id, shop_name, shop_description, address, city, area, pincode,
         gst_number, contact_number, opening_time, closing_time, shop_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [retailer_id, shop_name, shop_description || null, address, city, area,
       pincode, gst_number || null, contact_number, opening_time, closing_time, shop_image]
    );

    const [shop] = await db.query('SELECT * FROM shops WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, message: 'Shop created successfully!', shop: shop[0] });
  } catch (err) {
    console.error('createShop:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Get my shop  GET /api/shops/my-shop
exports.getMyShop = async (req, res) => {
  try {
    const [shops] = await db.query('SELECT * FROM shops WHERE retailer_id = ?', [req.user.id]);
    if (shops.length === 0) {
      return res.status(404).json({ success: false, message: 'No shop found.' });
    }
    res.status(200).json({ success: true, shop: shops[0] });
  } catch (err) {
    console.error('getMyShop:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Update shop  PUT /api/shops/:id
exports.updateShop = async (req, res) => {
  try {
    const [shops] = await db.query('SELECT * FROM shops WHERE id = ? AND retailer_id = ?', [req.params.id, req.user.id]);
    if (shops.length === 0) {
      return res.status(404).json({ success: false, message: 'Shop not found or access denied.' });
    }

    const {
      shop_name, shop_description, address, city, area, pincode,
      gst_number, contact_number, opening_time, closing_time, shop_status,
    } = req.body;

    if (contact_number) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(contact_number)) {
        return res.status(400).json({ success: false, message: 'Contact number must be 10 digits.' });
      }
    }

    const shop_image = req.file ? `/uploads/shops/${req.file.filename}` : null;

    await db.query(
      `UPDATE shops SET
        shop_name = COALESCE(?, shop_name),
        shop_description = COALESCE(?, shop_description),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        area = COALESCE(?, area),
        pincode = COALESCE(?, pincode),
        gst_number = COALESCE(?, gst_number),
        contact_number = COALESCE(?, contact_number),
        opening_time = COALESCE(?, opening_time),
        closing_time = COALESCE(?, closing_time),
        shop_status = COALESCE(?, shop_status),
        shop_image = COALESCE(?, shop_image)
       WHERE id = ?`,
      [shop_name, shop_description, address, city, area, pincode,
       gst_number, contact_number, opening_time, closing_time, shop_status, shop_image, req.params.id]
    );

    const [updated] = await db.query('SELECT * FROM shops WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Shop updated.', shop: updated[0] });
  } catch (err) {
    console.error('updateShop:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Delete shop  DELETE /api/shops/:id
exports.deleteShop = async (req, res) => {
  try {
    const [shops] = await db.query('SELECT id FROM shops WHERE id = ? AND retailer_id = ?', [req.params.id, req.user.id]);
    if (shops.length === 0) {
      return res.status(404).json({ success: false, message: 'Shop not found or access denied.' });
    }
    await db.query('DELETE FROM shops WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Shop deleted.' });
  } catch (err) {
    console.error('deleteShop:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
