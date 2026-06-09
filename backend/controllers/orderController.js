const db = require('../config/db');
const crypto = require('crypto');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const customer_id = req.user.id;
    const { shop_id, total_amount, items } = req.body;

    if (!shop_id || !total_amount || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Missing order details' });
    }

    // 1. Insert into orders table
    const qr_token = crypto.randomBytes(16).toString('hex'); // unique 32-char token

    const [orderRes] = await connection.query(
      'INSERT INTO orders (customer_id, shop_id, total_amount, status, qr_token) VALUES (?, ?, ?, ?, ?)',
      [customer_id, shop_id, total_amount, 'Pending', qr_token]
    );

    const orderId = orderRes.insertId;

    // 2. Validate stock and decrement for each item
    for (const item of items) {
      const productId = item.id || item.product_id;
      const qty = item.qty || item.quantity;

      const [rows] = await connection.query(
        'SELECT stock_quantity, product_name FROM products WHERE id = ? AND shop_id = ? FOR UPDATE',
        [productId, shop_id]
      );

      if (!rows.length) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: `Product not found: ${item.product_name}` });
      }

      if (rows[0].stock_quantity < qty) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${rows[0].product_name}". Available: ${rows[0].stock_quantity}, Requested: ${qty}`
        });
      }

      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [qty, productId]
      );
    }

    // 3. Insert items into order_items table
    const itemRows = items.map(item => [
      orderId,
      item.id || item.product_id,
      item.product_name,
      item.price,
      item.qty || item.quantity,
      item.unit_type
    ]);

    await connection.query(
      'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, unit_type) VALUES ?',
      [itemRows]
    );

    await connection.commit();
    res.status(201).json({ success: true, message: 'Order placed successfully', order_id: orderId, qr_token });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const [orders] = await db.query(
      `SELECT o.*, s.shop_name, s.area, s.city 
       FROM orders o 
       JOIN shops s ON o.shop_id = s.id 
       WHERE o.id = ?`,
      [orderId]
    );

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    order.items = items;

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for the logged-in customer
// @route   GET /api/orders/customer
// @access  Private (Customer)
exports.getCustomerOrders = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const [orders] = await db.query(
      `SELECT o.*, s.shop_name, s.area, s.city 
       FROM orders o 
       JOIN shops s ON o.shop_id = s.id 
       WHERE o.customer_id = ? 
       ORDER BY o.created_at DESC`,
      [customerId]
    );

    // Get items for each order
    for (let order of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for the retailer's shop
// @route   GET /api/orders/retailer
// @access  Private (Retailer)
exports.getRetailerOrders = async (req, res, next) => {
  try {
    const retailerId = req.user.id;

    // First find retailer's shop
    const [shops] = await db.query('SELECT id FROM shops WHERE retailer_id = ?', [retailerId]);
    if (!shops.length) {
      return res.json({ success: true, orders: [] });
    }

    const shopId = shops[0].id;

    const [orders] = await db.query(
      `SELECT o.*, u.full_name AS customer_name, u.phone AS customer_phone 
       FROM orders o 
       JOIN users u ON o.customer_id = u.id 
       WHERE o.shop_id = ? 
       ORDER BY o.created_at DESC`,
      [shopId]
    );

    // Get items for each order
    for (let order of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Retailer)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status, estimated_time } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    // Verify retailer owns the shop that has this order
    const retailerId = req.user.id;
    const [shops] = await db.query('SELECT id FROM shops WHERE retailer_id = ?', [retailerId]);
    if (!shops.length) {
      return res.status(403).json({ success: false, message: 'Not authorized: Retailer does not own a shop' });
    }
    const shopId = shops[0].id;

    const [orders] = await db.query('SELECT shop_id FROM orders WHERE id = ?', [orderId]);
    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orders[0].shop_id !== shopId) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this order' });
    }

    // Update status
    if (estimated_time) {
      await db.query(
        'UPDATE orders SET status = ?, estimated_time = ? WHERE id = ?',
        [status, estimated_time, orderId]
      );
    } else {
      await db.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
      );
    }

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify QR token and complete the order
// @route   GET /api/orders/verify-qr/:token
// @access  Private (Retailer)
exports.verifyQrToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const retailerId = req.user.id;

    // Get retailer's shop
    const [shops] = await db.query('SELECT id FROM shops WHERE retailer_id = ?', [retailerId]);
    if (!shops.length) {
      return res.status(403).json({ success: false, message: 'No shop found for this retailer' });
    }
    const shopId = shops[0].id;

    // Find the order by qr_token
    const [orders] = await db.query(
      `SELECT o.*, u.full_name AS customer_name 
       FROM orders o 
       JOIN users u ON o.customer_id = u.id 
       WHERE o.qr_token = ?`,
      [token]
    );

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Invalid QR code. Order not found.' });
    }

    const order = orders[0];

    // Make sure this order belongs to the retailer's shop
    if (order.shop_id !== shopId) {
      return res.status(403).json({ success: false, message: 'This order does not belong to your shop.' });
    }

    // Order must be in "Ready For Pickup" to be completed via QR
    if (order.status !== 'Ready For Pickup') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete order. Current status: "${order.status}". Order must be "Ready For Pickup".`
      });
    }

    // Mark order as Completed
    await db.query('UPDATE orders SET status = ? WHERE id = ?', ['Completed', order.id]);

    res.json({
      success: true,
      message: `Order #ORD-${order.id} verified and marked as Completed.`,
      order: { id: order.id, customer_name: order.customer_name, total_amount: order.total_amount }
    });
  } catch (error) {
    next(error);
  }
};
