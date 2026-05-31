-- ========================
-- ROLE
-- ========================
INSERT INTO role (name, description) VALUES 
('ADMIN', 'Quản trị viên hệ thống'),
('USER', 'Khách hàng mua sắm'),
('MANAGER','Quản lý'),
('STAFF', 'Nhân viên kho và đơn hàng')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ========================
-- ACCOUNT
-- ========================
INSERT INTO account (role_id, email, password_hash, full_name, phone, status) VALUES 
(1, 'admin@chamviet.com', '123456', 'Admin ChamViet', '0901234567', 'ACTIVE'),
(2, 'customer1@gmail.com', '123456', 'Nguyễn Văn A', '0912345678', 'ACTIVE'),
(2, 'customer2@gmail.com', '123456', 'Trần Thị B', '0987654321', 'ACTIVE')
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id), password_hash=VALUES(password_hash), full_name=VALUES(full_name), phone=VALUES(phone), status=VALUES(status);

-- ========================
-- CATEGORY
-- ========================
INSERT INTO category (parent_id, name, slug) VALUES 
(NULL, 'Đồ chơi giáo dục', 'do-choi-giao-duc'),
(1, 'Puzzle gỗ', 'puzzle-go'),
(NULL, 'Sách thiếu nhi', 'sach-thieu-nhi')
ON DUPLICATE KEY UPDATE parent_id=VALUES(parent_id), name=VALUES(name);

-- ========================
-- AGE RANGE
-- ========================
INSERT INTO age_range (name, min_age, max_age) VALUES
('4-6', 4, 6),
('6-8', 6, 8),
('8-12', 8, 12)
ON DUPLICATE KEY UPDATE min_age=VALUES(min_age), max_age=VALUES(max_age);

-- ========================
-- AGE RULE (gợi ý)
-- ========================
INSERT INTO age_piece_rule (age_range_id, recommended_piece_count, difficulty_level) VALUES
(1, 20, 'EASY'),
(2, 30, 'MEDIUM'),
(3, 50, 'HARD')
ON DUPLICATE KEY UPDATE recommended_piece_count=VALUES(recommended_piece_count), difficulty_level=VALUES(difficulty_level);

-- ========================
-- PRODUCT
-- ========================
INSERT INTO product (category_id, name, slug, description, status) VALUES 
(2, 'Hộp Lạc Long Quân', 'hop-lac-long-quan', 'Hộp kể chuyện gồm 2 tranh puzzle và 1 pepper ghost', 'ACTIVE'),
(2, 'Hộp Bánh Chưng Bánh Dày', 'hop-banh-chung-banh-day', 'Hộp kể chuyện gồm 2 tranh puzzle và 1 pepper ghost', 'ACTIVE')
ON DUPLICATE KEY UPDATE category_id=VALUES(category_id), description=VALUES(description), status=VALUES(status);

-- ========================
-- PRODUCT VARIANT
-- ========================
INSERT INTO product_variant (product_id, age_range_id, sku, price, attributes) VALUES 
(1, 1, 'LLQ-BOX-01', 500000.00, '{"boxType":"standard"}'),
(2, 1, 'BCD-BOX-01', 420000.00, '{"boxType":"standard"}')
ON DUPLICATE KEY UPDATE product_id=VALUES(product_id), age_range_id=VALUES(age_range_id), price=VALUES(price), attributes=VALUES(attributes);

-- ========================
-- COMPONENT ITEM
-- ========================
INSERT INTO component_item (
    age_range_id, sku, name, component_type, video_url, story_title, story_content, story_qa_json, piece_count, stock_on_hand, reserved_stock, status
) VALUES
(1, 'PUZ-LLQ-01', 'Tranh Lạc Long Quân - Cảnh 1', 'PUZZLE', 'https://youtu.be/Mb0RWyh3sqQ', 'Lạc Long Quân và Âu Cơ', 'Ngày xưa, ở miền đất Lạc Việt có vị thần Lạc Long Quân tài giỏi và nàng tiên Âu Cơ hiền hậu. Hai người thương nhau rồi sinh ra một bọc trăm trứng, nở thành một trăm người con. Sau này, năm mươi người con theo cha xuống biển, năm mươi người con theo mẹ lên núi. Từ đó, người Việt luôn nhớ mình có cùng một cội nguồn và yêu thương nhau như anh em một nhà.', '[{\"question\":\"Lạc Long Quân là ai?\",\"answer\":\"Là một vị thần tài giỏi.\"},{\"question\":\"Âu Cơ sinh ra điều gì đặc biệt?\",\"answer\":\"Một bọc trăm trứng.\"}]', 20, 79, 0, 'ACTIVE'),
(1, 'PUZ-LLQ-02', 'Tranh Lạc Long Quân - Cảnh 2', 'PUZZLE', 'llq-scene-02-demo', 'Lạc Long Quân và Âu Cơ', 'Lạc Long Quân đưa một nửa người con xuống biển, còn Âu Cơ đưa một nửa người con lên núi. Dù ở đâu, mọi người vẫn luôn nhớ mình là anh em cùng một nhà.', '[{\"question\":\"Người Việt thường tự hào gọi mình là gì?\",\"answer\":\"Con Rồng cháu Tiên.\"}]', 20, 79, 0, 'ACTIVE'),
(NULL, 'PG-STD-01', 'Pepper Ghost Chuẩn', 'PEPPER_GHOST', NULL, NULL, NULL, NULL, NULL, 59, 0, 'ACTIVE'),
(1, 'PUZ-BCD-01', 'Tranh Bánh Chưng - Cảnh 1', 'PUZZLE', 'bcd-scene-01-demo', 'Bánh Chưng Bánh Dày', 'Lang Liêu làm bánh chưng bánh dày để dâng vua Hùng.', '[{\"question\":\"Ai là người làm bánh chưng bánh dày?\",\"answer\":\"Lang Liêu.\"}]', 18, 50, 1, 'ACTIVE'),
(1, 'PUZ-BCD-02', 'Tranh Bánh Chưng - Cảnh 2', 'PUZZLE', 'bcd-scene-02-demo', 'Bánh Chưng Bánh Dày', 'Bánh tượng trưng cho trời đất và lòng hiếu thảo.', '[{\"question\":\"Bánh chưng tượng trưng cho điều gì?\",\"answer\":\"Tượng trưng cho đất.\"}]', 18, 50, 1, 'ACTIVE'),
(NULL, 'PG-STD-02', 'Pepper Ghost Chuẩn Dự Phòng', 'PEPPER_GHOST', NULL, NULL, NULL, NULL, NULL, 45, 1, 'ACTIVE')
ON DUPLICATE KEY UPDATE
    age_range_id=VALUES(age_range_id),
    name=VALUES(name),
    video_url=VALUES(video_url),
    story_title=VALUES(story_title),
    story_content=VALUES(story_content),
    story_qa_json=VALUES(story_qa_json),
    piece_count=VALUES(piece_count),
    stock_on_hand=VALUES(stock_on_hand),
    reserved_stock=VALUES(reserved_stock),
    status=VALUES(status);

-- ========================
-- PRODUCT VARIANT COMPONENT
-- ========================
INSERT INTO product_variant_component (product_variant_id, component_item_id, quantity, sort_order) VALUES
(1, 1, 1, 0),
(1, 2, 1, 1),
(1, 3, 1, 2),
(2, 4, 1, 0),
(2, 5, 1, 1),
(2, 6, 1, 2)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity), sort_order=VALUES(sort_order);

-- ========================
-- PRODUCT IMAGE
-- ========================
INSERT INTO product_image (product_id, image_url, sort_order, is_primary) VALUES 
(1, 'https://img.chamviet.com/crct-1.jpg', 0, 1),
(1, 'https://img.chamviet.com/crct-2.jpg', 1, 0),
(2, 'https://img.chamviet.com/btbg-1.jpg', 0, 1)
ON DUPLICATE KEY UPDATE image_url=VALUES(image_url), sort_order=VALUES(sort_order), is_primary=VALUES(is_primary);

-- ========================
-- VOUCHER
-- ========================
INSERT INTO voucher (code, discount_type, discount_value, min_order_value, start_date, end_date, usage_limit) VALUES 
('CHAMVIET2026', 'FIXED', 50000, 200000, '2026-01-01', '2026-12-31', 100),
('SALE10', 'PERCENT', 10, 100000, '2026-01-01', '2026-12-31', 200)
ON DUPLICATE KEY UPDATE discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), min_order_value=VALUES(min_order_value), start_date=VALUES(start_date), end_date=VALUES(end_date), usage_limit=VALUES(usage_limit);

-- ========================
-- ORDERS
-- ========================
INSERT INTO orders (
    account_id, voucher_id, status, total_price, final_price,
    province, district, ward, address_detail, shipping_address
) VALUES 
(2, 1, 'PACKING', 500000, 450000,
 'Bắc Ninh', 'Từ Sơn', 'Đông Ngàn', 'Số 10 Lý Thái Tổ',
 'Số 10 Lý Thái Tổ, Đông Ngàn, Từ Sơn, Bắc Ninh'),

(3, NULL, 'RESERVED', 420000, 420000,
 'Hà Nội', 'Hoàn Kiếm', 'Tràng Tiền', 'Số 1 Tràng Tiền',
 'Số 1 Tràng Tiền, Tràng Tiền, Hoàn Kiếm, Hà Nội')
ON DUPLICATE KEY UPDATE account_id=VALUES(account_id), voucher_id=VALUES(voucher_id), status=VALUES(status), total_price=VALUES(total_price), final_price=VALUES(final_price), province=VALUES(province), district=VALUES(district), ward=VALUES(ward), address_detail=VALUES(address_detail), shipping_address=VALUES(shipping_address);

-- ========================
-- ORDER DETAIL
-- ========================
INSERT INTO order_detail (
    order_id, product_variant_id, quantity, snapshot_price, snapshot_product_name, snapshot_variant_sku, snapshot_components_json
) VALUES 
(1, 1, 1, 500000, 'Hộp Lạc Long Quân', 'LLQ-BOX-01', '[{\"componentId\":1,\"sku\":\"PUZ-LLQ-01\",\"name\":\"Tranh Lạc Long Quân - Cảnh 1\",\"componentType\":\"PUZZLE\",\"quantity\":1,\"sortOrder\":0},{\"componentId\":2,\"sku\":\"PUZ-LLQ-02\",\"name\":\"Tranh Lạc Long Quân - Cảnh 2\",\"componentType\":\"PUZZLE\",\"quantity\":1,\"sortOrder\":1},{\"componentId\":3,\"sku\":\"PG-STD-01\",\"name\":\"Pepper Ghost Chuẩn\",\"componentType\":\"PEPPER_GHOST\",\"quantity\":1,\"sortOrder\":2}]'),
(2, 2, 1, 420000, 'Hộp Bánh Chưng Bánh Dày', 'BCD-BOX-01', '[{\"componentId\":4,\"sku\":\"PUZ-BCD-01\",\"name\":\"Tranh Bánh Chưng - Cảnh 1\",\"componentType\":\"PUZZLE\",\"quantity\":1,\"sortOrder\":0},{\"componentId\":5,\"sku\":\"PUZ-BCD-02\",\"name\":\"Tranh Bánh Chưng - Cảnh 2\",\"componentType\":\"PUZZLE\",\"quantity\":1,\"sortOrder\":1},{\"componentId\":6,\"sku\":\"PG-STD-02\",\"name\":\"Pepper Ghost Chuẩn Dự Phòng\",\"componentType\":\"PEPPER_GHOST\",\"quantity\":1,\"sortOrder\":2}]')
ON DUPLICATE KEY UPDATE
    product_variant_id=VALUES(product_variant_id),
    quantity=VALUES(quantity),
    snapshot_price=VALUES(snapshot_price),
    snapshot_product_name=VALUES(snapshot_product_name),
    snapshot_variant_sku=VALUES(snapshot_variant_sku),
    snapshot_components_json=VALUES(snapshot_components_json);

-- ========================
-- ORDER LOG
-- ========================
INSERT INTO order_log (order_id, old_status, new_status, changed_by, note) VALUES 
(1, 'PENDING', 'CONFIRMED', 1, 'Xác nhận tự động'),
(2, 'PENDING', 'PENDING', 2, 'Khởi tạo đơn hàng')
ON DUPLICATE KEY UPDATE old_status=VALUES(old_status), new_status=VALUES(new_status), changed_by=VALUES(changed_by), note=VALUES(note);

-- ========================
-- DELIVERY
-- ========================
INSERT INTO delivery (order_id, provider, tracking_code, shipping_fee, status, cod_amount, cod_status) VALUES 
(1, 'GHTK', 'GHTK123456', 30000, 'IN_TRANSIT', 450000, 'PENDING')
ON DUPLICATE KEY UPDATE provider=VALUES(provider), tracking_code=VALUES(tracking_code), shipping_fee=VALUES(shipping_fee), status=VALUES(status), cod_amount=VALUES(cod_amount), cod_status=VALUES(cod_status);

-- ========================
-- PAYMENT
-- ========================
INSERT INTO payment (order_id, method, amount, status, transaction_ref) VALUES 
(1, 'COD', 450000, 'PENDING', NULL),
(2, 'MOMO', 150000, 'SUCCESS', 'MOMO123456')
ON DUPLICATE KEY UPDATE method=VALUES(method), amount=VALUES(amount), status=VALUES(status), transaction_ref=VALUES(transaction_ref);

-- ========================
-- INVENTORY TRANSACTION
-- ========================
INSERT INTO inventory_transaction (component_item_id, type, quantity, reference_id, note) VALUES 
(1, 'IMPORT', 80, NULL, 'Nhập kho ban đầu puzzle LLQ 1'),
(2, 'IMPORT', 80, NULL, 'Nhập kho ban đầu puzzle LLQ 2'),
(3, 'IMPORT', 60, NULL, 'Nhập kho ban đầu pepper ghost 1'),
(4, 'IMPORT', 50, NULL, 'Nhập kho ban đầu puzzle BCD 1'),
(5, 'IMPORT', 50, NULL, 'Nhập kho ban đầu puzzle BCD 2'),
(6, 'IMPORT', 45, NULL, 'Nhập kho ban đầu pepper ghost 2'),
(1, 'CONSUME', 1, 1, 'Đóng gói đơn #1'),
(2, 'CONSUME', 1, 1, 'Đóng gói đơn #1'),
(3, 'CONSUME', 1, 1, 'Đóng gói đơn #1'),
(4, 'RESERVE', 1, 2, 'Giữ hàng cho đơn #2'),
(5, 'RESERVE', 1, 2, 'Giữ hàng cho đơn #2'),
(6, 'RESERVE', 1, 2, 'Giữ hàng cho đơn #2')
ON DUPLICATE KEY UPDATE type=VALUES(type), quantity=VALUES(quantity), reference_id=VALUES(reference_id), note=VALUES(note);
