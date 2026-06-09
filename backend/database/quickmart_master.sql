-- ============================================
-- QuickMart Master Database Script
-- ============================================

-- DROP DATABASE IF EXISTS quickmart;
CREATE DATABASE IF NOT EXISTS quickmart;
USE quickmart;

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(100)  NOT NULL,
  email       VARCHAR(100)  UNIQUE NOT NULL,
  phone       VARCHAR(15)   NOT NULL,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('customer','retailer') NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email      (email),
  INDEX idx_role       (role),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: shops
-- ============================================
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
  INDEX idx_retailer_id (retailer_id),
  INDEX idx_city        (city),
  INDEX idx_pincode     (pincode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  shop_id         INT           NOT NULL,
  product_name    VARCHAR(100)  NOT NULL,
  category        VARCHAR(100)  NOT NULL,
  description     TEXT,
  unit_type       ENUM('kg','gram','liter','piece','packet') NOT NULL,
  price           DECIMAL(10,2) NOT NULL,
  stock_quantity  DECIMAL(10,2) NOT NULL DEFAULT 0,
  product_image   VARCHAR(255),
  is_available    BOOLEAN       DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  INDEX idx_shop_id    (shop_id),
  INDEX idx_category   (category),
  INDEX idx_available  (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  customer_id    INT            NOT NULL,
  shop_id        INT            NOT NULL,
  total_amount   DECIMAL(10,2)  NOT NULL,
  status         ENUM('Pending','Accepted','Packing','Ready For Pickup','Completed','Declined')
                                NOT NULL DEFAULT 'Pending',
  estimated_time VARCHAR(50)    DEFAULT NULL,
  qr_token       VARCHAR(64)    UNIQUE DEFAULT NULL,
  created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shop_id)     REFERENCES shops(id) ON DELETE CASCADE,
  INDEX idx_customer_id (customer_id),
  INDEX idx_shop_id     (shop_id),
  INDEX idx_status      (status),
  INDEX idx_qr_token    (qr_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: order_items
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  order_id     INT            NOT NULL,
  product_id   INT            DEFAULT NULL,
  product_name VARCHAR(100)   NOT NULL,
  price        DECIMAL(10,2)  NOT NULL,
  quantity     DECIMAL(10,2)  NOT NULL,
  unit_type    VARCHAR(20)    NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id   (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Verify
-- ============================================
SELECT 'QuickMart DB setup complete!' AS Status;
SHOW TABLES;
