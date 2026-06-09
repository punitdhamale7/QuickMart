const db = require('../config/db');

// @desc  GET /api/dashboard/stats  — retailer dashboard real numbers
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Find retailer's shop
    const [shops] = await db.query(
      'SELECT id FROM shops WHERE retailer_id = ?', [req.user.id]
    );
    if (!shops.length) {
      return res.status(404).json({ success: false, message: 'No shop found.' });
    }
    const shopId = shops[0].id;

    // 2. Product stats
    const [[productStats]] = await db.query(`
      SELECT
        COUNT(*)                                      AS total_products,
        COALESCE(SUM(is_available = 1), 0)            AS available_products,
        COALESCE(SUM(stock_quantity < 10), 0)         AS low_stock_count
      FROM products WHERE shop_id = ?
    `, [shopId]);

    // 3. Order stats  (orders table may not exist yet — safe fallback)
    let orderStats = {
      total_orders: 0,
      active_orders: 0,
      completed_orders: 0,
      total_revenue: 0,
      today_orders: 0,
      today_revenue: 0,
    };

    const [tableCheck] = await db.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.tables
       WHERE table_schema = ? AND table_name = 'orders'`,
      [process.env.DB_NAME]
    );

    if (tableCheck[0].cnt > 0) {
      const [[os]] = await db.query(`
        SELECT
          COUNT(*)                                          AS total_orders,
          COALESCE(SUM(status IN ('accepted','packing','ready_for_pickup')), 0) AS active_orders,
          COALESCE(SUM(status = 'completed'), 0)           AS completed_orders,
          COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END), 0) AS total_revenue,
          COALESCE(SUM(DATE(created_at) = CURDATE()), 0)   AS today_orders,
          COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() AND status = 'completed'
                            THEN total_amount ELSE 0 END), 0) AS today_revenue
        FROM orders WHERE shop_id = ?
      `, [shopId]);
      orderStats = os;
    }

    // 4. Low stock items
    const [lowStockItems] = await db.query(`
      SELECT product_name, stock_quantity, unit_type
      FROM products
      WHERE shop_id = ? AND stock_quantity < 10
      ORDER BY stock_quantity ASC
      LIMIT 6
    `, [shopId]);

    // 5. Recent orders (safe fallback)
    let recentOrders = [];
    const [tableCheck2] = await db.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.tables
       WHERE table_schema = ? AND table_name = 'orders'`,
      [process.env.DB_NAME]
    );
    if (tableCheck2[0].cnt > 0) {
      const [rows] = await db.query(`
        SELECT o.id, o.status, o.total_amount, o.created_at,
               u.full_name AS customer_name
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        WHERE o.shop_id = ?
        ORDER BY o.created_at DESC
        LIMIT 10
      `, [shopId]);
      recentOrders = rows;
    }

    res.json({
      success: true,
      stats: {
        total_products:    Number(productStats.total_products),
        available_products:Number(productStats.available_products),
        low_stock_count:   Number(productStats.low_stock_count),
        total_orders:      Number(orderStats.total_orders),
        active_orders:     Number(orderStats.active_orders),
        completed_orders:  Number(orderStats.completed_orders),
        total_revenue:     Number(orderStats.total_revenue),
        today_orders:      Number(orderStats.today_orders),
        today_revenue:     Number(orderStats.today_revenue),
      },
      low_stock_items: lowStockItems,
      recent_orders:   recentOrders,
    });
  } catch (err) {
    console.error('getDashboardStats:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc  GET /api/dashboard/analytics  — full analytics data for retailer
exports.getAnalytics = async (req, res) => {
  try {
    const [shops] = await db.query(
      'SELECT id FROM shops WHERE retailer_id = ?', [req.user.id]
    );
    if (!shops.length) {
      return res.status(404).json({ success: false, message: 'No shop found.' });
    }
    const shopId = shops[0].id;

    // ── 1. KPI totals (completed orders only for revenue) ──────────────────
    const [[kpi]] = await db.query(`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'Completed' THEN total_amount ELSE 0 END), 0)  AS total_revenue,
        COUNT(*)                                                                          AS total_orders,
        COALESCE(AVG(CASE WHEN status = 'Completed' THEN total_amount END), 0)           AS avg_order_value
      FROM orders WHERE shop_id = ?
    `, [shopId]);

    const [[prevKpi]] = await db.query(`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'Completed' THEN total_amount ELSE 0 END), 0)  AS total_revenue,
        COUNT(*)                                                                          AS total_orders,
        COALESCE(AVG(CASE WHEN status = 'Completed' THEN total_amount END), 0)           AS avg_order_value
      FROM orders
      WHERE shop_id = ?
        AND created_at < DATE_FORMAT(NOW(), '%Y-%m-01')
        AND created_at >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
    `, [shopId]);

    // total products sold (qty summed from completed order items)
    const [[soldRow]] = await db.query(`
      SELECT COALESCE(SUM(oi.quantity), 0) AS products_sold
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.shop_id = ? AND o.status = 'Completed'
    `, [shopId]);

    const [[prevSoldRow]] = await db.query(`
      SELECT COALESCE(SUM(oi.quantity), 0) AS products_sold
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.shop_id = ? AND o.status = 'Completed'
        AND o.created_at < DATE_FORMAT(NOW(), '%Y-%m-01')
        AND o.created_at >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
    `, [shopId]);

    const pctChange = (curr, prev) => {
      if (!prev || prev === 0) return curr > 0 ? '+100%' : '0%';
      const diff = ((curr - prev) / prev) * 100;
      return (diff >= 0 ? '+' : '') + diff.toFixed(0) + '%';
    };

    const kpis = {
      total_revenue:    Number(kpi.total_revenue),
      total_orders:     Number(kpi.total_orders),
      avg_order_value:  Number(kpi.avg_order_value),
      products_sold:    Number(soldRow.products_sold),
      revenue_change:   pctChange(Number(kpi.total_revenue),   Number(prevKpi.total_revenue)),
      orders_change:    pctChange(Number(kpi.total_orders),    Number(prevKpi.total_orders)),
      avg_change:       pctChange(Number(kpi.avg_order_value), Number(prevKpi.avg_order_value)),
      sold_change:      pctChange(Number(soldRow.products_sold), Number(prevSoldRow.products_sold)),
    };

    // ── 2. Daily sales — last 7 days ───────────────────────────────────────
    const [dailyRows] = await db.query(`
      SELECT
        DATE(created_at)                    AS date,
        DAYNAME(created_at)                 AS day_name,
        COALESCE(SUM(CASE WHEN status = 'Completed' THEN total_amount ELSE 0 END), 0) AS sales,
        COUNT(*)                            AS orders
      FROM orders
      WHERE shop_id = ?
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at), DAYNAME(created_at)
      ORDER BY DATE(created_at)
    `, [shopId]);

    // Fill missing days with 0
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
      const found = dailyRows.find(r => {
        const rd = new Date(r.date);
        return rd.toISOString().slice(0, 10) === dateStr;
      });
      daily.push({ day: dayShort, date: dateStr, sales: found ? Number(found.sales) : 0, orders: found ? Number(found.orders) : 0 });
    }

    // ── 3. Monthly sales — last 6 months ──────────────────────────────────
    const [monthlyRows] = await db.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m')    AS month_key,
        DATE_FORMAT(created_at, '%b')       AS month_name,
        COALESCE(SUM(CASE WHEN status = 'Completed' THEN total_amount ELSE 0 END), 0) AS sales,
        COUNT(*)                            AS orders
      FROM orders
      WHERE shop_id = ?
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b')
      ORDER BY month_key
    `, [shopId]);

    // Fill missing months with 0
    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      const name = d.toLocaleDateString('en-US', { month: 'short' });
      const found = monthlyRows.find(r => r.month_key === key);
      monthly.push({ m: name, month_key: key, sales: found ? Number(found.sales) : 0, orders: found ? Number(found.orders) : 0 });
    }

    // ── 4. Top selling products ────────────────────────────────────────────
    const [topProducts] = await db.query(`
      SELECT
        oi.product_name,
        SUM(oi.quantity)             AS units_sold,
        SUM(oi.quantity * oi.price)  AS revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.shop_id = ? AND o.status = 'Completed'
      GROUP BY oi.product_name
      ORDER BY units_sold DESC
      LIMIT 5
    `, [shopId]);

    const maxSold = topProducts.length > 0 ? Number(topProducts[0].units_sold) : 1;
    const topProductsFormatted = topProducts.map(p => ({
      name:    p.product_name,
      sold:    Number(p.units_sold),
      revenue: Number(p.revenue),
      pct:     Math.round((Number(p.units_sold) / maxSold) * 100),
    }));

    res.json({
      success: true,
      kpis,
      daily,
      monthly,
      top_products: topProductsFormatted,
    });
  } catch (err) {
    console.error('getAnalytics:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
