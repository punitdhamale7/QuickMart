const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await conn.query(`
    CREATE TABLE IF NOT EXISTS shops (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      retailer_id      INT           NOT NULL,
      shop_name        VARCHAR(100)  NOT NULL,
      shop_description TEXT,
      address          TEXT          NOT NULL,
      city             VARCHAR(50)   NOT NULL,
      area             VARCHAR(50)   NOT NULL,
      pincode          VARCHAR(10)   NOT NULL,
      gst_number       VARCHAR(20),
      contact_number   VARCHAR(15)   NOT NULL,
      opening_time     TIME          NOT NULL,
      closing_time     TIME          NOT NULL,
      shop_status      ENUM('open','closed') DEFAULT 'open',
      shop_image       VARCHAR(255) DEFAULT NULL,
      created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (retailer_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_retailer (retailer_id),
      INDEX idx_retailer_id (retailer_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ shops table ready');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      shop_id        INT           NOT NULL,
      product_name   VARCHAR(100)  NOT NULL,
      category       VARCHAR(100)  NOT NULL,
      description    TEXT,
      unit_type      ENUM('kg','gram','liter','piece','packet') NOT NULL,
      price          DECIMAL(10,2) NOT NULL,
      stock_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
      product_image  VARCHAR(255),
      is_available   BOOLEAN       DEFAULT TRUE,
      created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
      INDEX idx_shop_id  (shop_id),
      INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ products table ready');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      customer_id     INT           NOT NULL,
      shop_id         INT           NOT NULL,
      total_amount    DECIMAL(10,2) NOT NULL,
      status          ENUM('Pending', 'Accepted', 'Packing', 'Ready For Pickup', 'Completed', 'Declined') DEFAULT 'Pending',
      estimated_time  VARCHAR(100),
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
      INDEX idx_customer_id (customer_id),
      INDEX idx_shop_id     (shop_id),
      INDEX idx_status      (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ orders table ready');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      order_id      INT           NOT NULL,
      product_id    INT           NOT NULL,
      product_name  VARCHAR(100)  NOT NULL,
      price         DECIMAL(10,2) NOT NULL,
      quantity      DECIMAL(10,2) NOT NULL,
      unit_type     VARCHAR(20)   NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      INDEX idx_order_id (order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ order_items table ready');

  const [tables] = await conn.query('SHOW TABLES');
  console.log('📋 All tables:', tables.map(t => Object.values(t)[0]).join(', '));
  await conn.end();
}

migrate().catch(e => { console.error('❌', e.message); process.exit(1); });
