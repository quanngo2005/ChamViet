-- ========================
-- ROLE
-- ========================
INSERT INTO role (name, description) VALUES 
('ADMIN', 'Quản trị viên hệ thống'),
('USER', 'Khách hàng mua sắm'),
('MANAGER','Quản lý'),
('STAFF', 'Nhân viên kho và đơn hàng');

-- ========================
-- ACCOUNT
-- ========================
INSERT INTO account (role_id, email, password_hash, full_name, phone, status) VALUES 
(1, 'admin@chamviet.com', '123456', 'Admin ChamViet', '0901234567', 'ACTIVE'),
(2, 'customer1@gmail.com', '123456', 'Nguyễn Văn A', '0912345678', 'ACTIVE'),
(2, 'customer2@gmail.com', '123456', 'Trần Thị B', '0987654321', 'ACTIVE');

-- ========================
-- CATEGORY
-- ========================
INSERT INTO category (parent_id, name, slug) VALUES 
(NULL, 'Đồ chơi giáo dục', 'do-choi-giao-duc'),
(1, 'Puzzle gỗ', 'puzzle-go'),
(NULL, 'Sách thiếu nhi', 'sach-thieu-nhi');

-- ========================
-- AGE RANGE
-- ========================
INSERT INTO age_range (name, min_age, max_age) VALUES
('4-6', 4, 6),
('6-8', 6, 8),
('8-12', 8, 12);

-- ========================
-- AGE RULE (gợi ý)
-- ========================
INSERT INTO age_piece_rule (age_range_id, recommended_piece_count, difficulty_level) VALUES
(1, 20, 'EASY'),
(2, 30, 'MEDIUM'),
(3, 50, 'HARD');

-- ========================
-- PRODUCT
-- ========================
INSERT INTO product (category_id, age_range_id, name, slug, description, status) VALUES 
(2, 1, 'Con Rồng Cháu Tiên', 'con-rong-chau-tien', 'Truyện nguồn gốc người Việt', 'ACTIVE'),
(2, 2, 'Bánh Trưng Bánh Giày', 'banh-trung-banh-day', 'Truyện dân gian Việt Nam', 'ACTIVE');

-- ========================
-- PRODUCT VARIANT
-- ========================
INSERT INTO product_variant (product_id, sku, price, stock, piece_count, attributes) VALUES 
(1, 'CRCT-20', 500000, 50, 20, '{"age":"4-6"}'),
(1, 'CRCT-30', 550000, 30, 30, '{"age":"6-8"}'),
(2, 'BTBG-20', 120000, 100, 20, '{"age":"4-6"}'),
(2, 'BTBG-30', 150000, 80, 30, '{"age":"6-8"}');

-- ========================
-- PRODUCT IMAGE
-- ========================
INSERT INTO product_image (product_id, image_url, sort_order, is_primary) VALUES 
(1, 'https://img.chamviet.com/crct-1.jpg', 0, 1),
(1, 'https://img.chamviet.com/crct-2.jpg', 1, 0),
(2, 'https://img.chamviet.com/btbg-1.jpg', 0, 1);

-- ========================
-- VOUCHER
-- ========================
INSERT INTO voucher (code, discount_type, discount_value, min_order_value, start_date, end_date, usage_limit) VALUES 
('CHAMVIET2026', 'FIXED', 50000, 200000, '2026-01-01', '2026-12-31', 100),
('SALE10', 'PERCENT', 10, 100000, '2026-01-01', '2026-12-31', 200);

-- ========================
-- ORDERS
-- ========================
INSERT INTO orders (
    account_id, voucher_id, status, total_price, final_price,
    province, district, ward, address_detail, shipping_address
) VALUES 
(2, 1, 'CONFIRMED', 500000, 450000,
 'Bắc Ninh', 'Từ Sơn', 'Đông Ngàn', 'Số 10 Lý Thái Tổ',
 'Số 10 Lý Thái Tổ, Đông Ngàn, Từ Sơn, Bắc Ninh'),

(3, NULL, 'PENDING', 150000, 150000,
 'Hà Nội', 'Hoàn Kiếm', 'Tràng Tiền', 'Số 1 Tràng Tiền',
 'Số 1 Tràng Tiền, Tràng Tiền, Hoàn Kiếm, Hà Nội');

-- ========================
-- ORDER DETAIL
-- ========================
INSERT INTO order_detail (order_id, product_variant_id, quantity, snapshot_price) VALUES 
(1, 1, 1, 500000),
(2, 4, 1, 150000);

-- ========================
-- ORDER LOG
-- ========================
INSERT INTO order_log (order_id, old_status, new_status, changed_by, note) VALUES 
(1, 'PENDING', 'CONFIRMED', 1, 'Xác nhận tự động'),
(2, 'PENDING', 'PENDING', 2, 'Khởi tạo đơn hàng');

-- ========================
-- DELIVERY
-- ========================
INSERT INTO delivery (order_id, provider, tracking_code, shipping_fee, status, cod_amount, cod_status) VALUES 
(1, 'GHTK', 'GHTK123456', 30000, 'IN_TRANSIT', 450000, 'PENDING');

-- ========================
-- PAYMENT
-- ========================
INSERT INTO payment (order_id, method, amount, status, transaction_ref) VALUES 
(1, 'COD', 450000, 'PENDING', NULL),
(2, 'MOMO', 150000, 'SUCCESS', 'MOMO123456');

-- ========================
-- INVENTORY TRANSACTION
-- ========================
INSERT INTO inventory_transaction (product_variant_id, type, quantity, reference_id, note) VALUES 
(1, 'IMPORT', 50, NULL, 'Nhập kho ban đầu'),
(1, 'EXPORT', 1, 1, 'Bán hàng đơn #1'),
(4, 'EXPORT', 1, 2, 'Bán hàng đơn #2');