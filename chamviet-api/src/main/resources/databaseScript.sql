-- ========================
-- DATABASE
-- ========================
CREATE DATABASE IF NOT EXISTS chamviet
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

USE chamviet;

-- ========================
-- ROLE
-- ========================
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- ========================
-- ACCOUNT
-- ========================
CREATE TABLE account (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status ENUM('ACTIVE','INACTIVE','BANNED') DEFAULT 'INACTIVE',
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- ========================
-- CATEGORY (TREE)
-- ========================
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    FOREIGN KEY (parent_id) REFERENCES category(id)
);

-- ========================
-- AGE RANGE
-- ========================
CREATE TABLE age_range (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50), -- "4-6"
    min_age INT NOT NULL,
    max_age INT NOT NULL
);

-- ========================
-- AGE RULE (GỢI Ý)
-- ========================
CREATE TABLE age_piece_rule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age_range_id INT NOT NULL,
    recommended_piece_count INT NOT NULL,
    difficulty_level ENUM('EASY','MEDIUM','HARD'),
    FOREIGN KEY (age_range_id) REFERENCES age_range(id)
);

-- ========================
-- PRODUCT
-- ========================
CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- ========================
-- PRODUCT VARIANT
-- ========================
CREATE TABLE product_variant (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    age_range_id INT,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    attributes JSON,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (age_range_id) REFERENCES age_range(id)
);

-- ========================
-- COMPONENT ITEM
-- ========================
CREATE TABLE component_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version BIGINT,
    age_range_id INT,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    component_type ENUM('PUZZLE','PEPPER_GHOST') NOT NULL,
    video_url VARCHAR(500),
    story_title VARCHAR(255),
    story_content TEXT,
    story_qa_json TEXT,
    piece_count INT,
    stock_on_hand INT NOT NULL DEFAULT 0 CHECK (stock_on_hand >= 0),
    reserved_stock INT NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    FOREIGN KEY (age_range_id) REFERENCES age_range(id)
);

-- ========================
-- PRODUCT VARIANT COMPONENT
-- ========================
CREATE TABLE product_variant_component (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_variant_id BIGINT NOT NULL,
    component_item_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    sort_order INT NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    FOREIGN KEY (product_variant_id) REFERENCES product_variant(id) ON DELETE CASCADE,
    FOREIGN KEY (component_item_id) REFERENCES component_item(id)
);

-- ========================
-- PRODUCT IMAGE
-- ========================
CREATE TABLE product_image (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_primary TINYINT(1) DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- ========================
-- VOUCHER
-- ========================
CREATE TABLE voucher (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('PERCENT','FIXED') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(15,2),
    max_discount DECIMAL(15,2),
    start_date DATETIME,
    end_date DATETIME,
    usage_limit INT,
    used_count INT DEFAULT 0,
    apply_scope ENUM('ALL','PRODUCT','CATEGORY') DEFAULT 'ALL',
    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE'
);

CREATE TABLE voucher_product (
    voucher_id BIGINT,
    product_id BIGINT,
    PRIMARY KEY (voucher_id, product_id),
    FOREIGN KEY (voucher_id) REFERENCES voucher(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE voucher_category (
    voucher_id BIGINT,
    category_id INT,
    PRIMARY KEY (voucher_id, category_id),
    FOREIGN KEY (voucher_id) REFERENCES voucher(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- ========================
-- ORDERS
-- ========================
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT NOT NULL,
    voucher_id BIGINT,
    status ENUM('PENDING','RESERVED','CONFIRMED','PACKING','SHIPPING','COMPLETED','CANCELLED') DEFAULT 'PENDING',
    total_price DECIMAL(15,2) NOT NULL,
    final_price DECIMAL(15,2) NOT NULL,

    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    address_detail VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    shipping_address TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id) REFERENCES account(id),
    FOREIGN KEY (voucher_id) REFERENCES voucher(id)
);

-- ========================
-- ORDER DETAIL
-- ========================
CREATE TABLE order_detail (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_variant_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    snapshot_price DECIMAL(15,2) NOT NULL,
    snapshot_product_name VARCHAR(255) NOT NULL,
    snapshot_variant_sku VARCHAR(100) NOT NULL,
    snapshot_components_json TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variant(id)
);

-- ========================
-- ORDER LOG
-- ========================
CREATE TABLE order_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by BIGINT,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ========================
-- DELIVERY
-- ========================
CREATE TABLE delivery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    provider VARCHAR(100),
    tracking_code VARCHAR(100),
    shipping_fee DECIMAL(15,2),
    status ENUM('PENDING','IN_TRANSIT','DELIVERED','RETURNED') DEFAULT 'PENDING',
    cod_amount INT,
    cod_status ENUM('PENDING','COLLECTED','TRANSFERRED'),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ========================
-- PAYMENT
-- ========================
CREATE TABLE payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    method ENUM('COD','BANK_TRANSFER','MOMO'),
    amount INT,
    status ENUM('PENDING','SUCCESS','FAILED'),
    transaction_ref VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ========================
-- INVENTORY TRANSACTION
-- ========================
CREATE TABLE inventory_transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    component_item_id BIGINT,
    type ENUM('IMPORT','RESERVE','RELEASE','CONSUME','ADJUST'),
    quantity INT NOT NULL,
    reference_id BIGINT,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (component_item_id) REFERENCES component_item(id)
);

-- Activation tokens for account verification
CREATE TABLE activation_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE
);

-- ========================
-- INDEXES
-- ========================
CREATE INDEX idx_product_category ON product(category_id);
CREATE INDEX idx_variant_product ON product_variant(product_id);
CREATE INDEX idx_variant_age ON product_variant(age_range_id);
CREATE INDEX idx_component_age ON component_item(age_range_id);
CREATE INDEX idx_variant_component_variant ON product_variant_component(product_variant_id);
CREATE INDEX idx_variant_component_item ON product_variant_component(component_item_id);

CREATE INDEX idx_orders_account ON orders(account_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_order_detail_order ON order_detail(order_id);

CREATE INDEX idx_inventory_component ON inventory_transaction(component_item_id);
