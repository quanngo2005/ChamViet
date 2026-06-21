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
INSERT INTO age_range (name, min_age, max_age, recommended_piece_count, difficulty_level) VALUES
('4-6', 4, 6, 20, 'EASY'),
('6-8', 6, 8, 30, 'MEDIUM'),
('8-12', 8, 12, 50, 'HARD')
ON DUPLICATE KEY UPDATE
    min_age=VALUES(min_age),
    max_age=VALUES(max_age),
    recommended_piece_count=VALUES(recommended_piece_count),
    difficulty_level=VALUES(difficulty_level);

-- ========================
-- PRODUCT
-- Chỉ giữ 1 box demo: Box tương tác kể chuyện
-- ========================
INSERT INTO product (category_id, name, slug, description, status) VALUES
(2, 'Box tương tác kể chuyện', 'box-tuong-tac-ke-chuyen', 'Box tương tác kể chuyện gồm 2 puzzle Sự tích Hồ Gươm, Sự tích Thánh Gióng và 1 Pepper Ghost.', 'ACTIVE')
ON DUPLICATE KEY UPDATE category_id=VALUES(category_id), name=VALUES(name), description=VALUES(description), status=VALUES(status);

-- ========================
-- PRODUCT VARIANT
-- ========================
INSERT INTO product_variant (product_id, sku, price, component_count, attributes) VALUES
(1, 'BOX-TTKT-01', 229000.00, 3, '{"boxType":"demo","stories":["Sự tích Hồ Gươm","Sự tích Thánh Gióng"]}')
ON DUPLICATE KEY UPDATE product_id=VALUES(product_id), price=VALUES(price), component_count=VALUES(component_count), attributes=VALUES(attributes);

-- ========================
-- COMPONENT
-- ========================
INSERT INTO component (
    age_range_id, sku, name, component_type, stock_on_hand, reserved_stock, status
) VALUES
(1, 'PUZ-HG-01', 'Sự tích Hồ Gươm', 'PUZZLE', 100, 0, 'ACTIVE'),
(1, 'PUZ-TG-01', 'Sự tích Thánh Gióng', 'PUZZLE', 100, 0, 'ACTIVE'),
(1, 'PUZ-CRCT-01', 'Con Rồng Cháu Tiên', 'PUZZLE', 100, 0, 'ACTIVE'),
(NULL, 'PG-STD-01', 'Pepper Ghost Chuẩn', 'PEPPER_GHOST', 100, 0, 'ACTIVE')
ON DUPLICATE KEY UPDATE
    age_range_id=VALUES(age_range_id),
    name=VALUES(name),
    component_type=VALUES(component_type),
    stock_on_hand=VALUES(stock_on_hand),
    reserved_stock=VALUES(reserved_stock),
    status=VALUES(status);

-- ========================
-- COMPONENT CONTENT
-- ========================
INSERT INTO component_content (
    component_id,
    video_url,
    story_title,
    story_content,
    story_qa_json,
    piece_count
) VALUES
(1,
'lct-uiT1PRw',
'Sự tích Hồ Gươm',
'Sự tích Hồ Gươm kể về Lê Lợi và nghĩa quân Lam Sơn trong cuộc kháng chiến chống quân Minh. Nhờ thanh gươm thần do Long Quân ban tặng, nghĩa quân đã giành thắng lợi, đất nước trở lại hòa bình. Sau đó, vua Lê Lợi trả lại thanh gươm cho Rùa Vàng trên hồ Tả Vọng, từ đó hồ được gọi là Hồ Hoàn Kiếm hay Hồ Gươm.',
'[{"question":"Trong câu chuyện Sự tích Hồ Gươm, ai là người đã đứng lên lãnh đạo nghĩa quân đánh đuổi quân Minh để cứu đất nước?","answer":"Lê Lợi"},{"question":"Chú Lê Thận đã tìm thấy vật gì đặc biệt khi kéo lưới dưới sông?","answer":"Lưỡi gươm thần"},{"question":"Nhờ có thanh gươm thần, nghĩa quân của vua Lê Lợi đã làm được điều gì?","answer":"Đánh thắng quân Minh"},{"question":"Sau khi đất nước hòa bình, ai đã xuất hiện trên mặt hồ để xin lại thanh gươm thần?","answer":"Rùa Vàng"},{"question":"Vì sao hồ Tả Vọng sau này được gọi là Hồ Hoàn Kiếm hay Hồ Gươm?","answer":"Vì vua Lê Lợi trả lại gươm thần"}]',
30),

(2,
'thanh-giong-demo-video',
'Sự tích Thánh Gióng',
'Sự tích Thánh Gióng kể về cậu bé Gióng sinh ra kỳ lạ, lên ba tuổi vẫn chưa biết nói cười nhưng khi đất nước bị giặc Ân xâm lược đã cất tiếng xin đi đánh giặc. Gióng lớn nhanh như thổi, cưỡi ngựa sắt, mặc áo giáp sắt, dùng gươm sắt và tre làng đánh tan quân giặc. Sau chiến thắng, Gióng bay về trời, trở thành biểu tượng người anh hùng cứu nước của dân tộc Việt Nam.',
'[{"question":"Thánh Gióng có được sinh ra giống như những em bé bình thường không?","answer":"Không"},{"question":"Lên ba tuổi nhưng Thánh Gióng vẫn chưa biết làm những gì?","answer":"Chưa biết nói, cười và đi"},{"question":"Khi nghe tin có giặc Ân xâm lược, Thánh Gióng đã yêu cầu nhà vua chuẩn bị những gì?","answer":"Ngựa sắt, gươm sắt và áo giáp sắt"},{"question":"Khi thanh gươm sắt bị gãy trong lúc chiến đấu, Thánh Gióng đã dùng gì để tiếp tục đánh giặc?","answer":"Tre"},{"question":"Sau khi đánh thắng giặc Ân và mang lại hòa bình cho đất nước, Thánh Gióng đã đi đâu?","answer":"Bay về trời"}]',
30),

(3,
'Mb0RWyh3sqQ',
'Con Rồng Cháu Tiên',
'Con Rồng Cháu Tiên kể về Lạc Long Quân và Âu Cơ sinh ra bọc trăm trứng, từ đó một trăm người con lớn lên khỏe mạnh và trở thành tổ tiên của người Việt. Khi các con khôn lớn, năm mươi người theo cha xuống biển, năm mươi người theo mẹ lên núi để cùng nhau mở mang bờ cõi, nhắc nhớ về tinh thần đoàn kết và chung nguồn cội.',
'[{"question":"Lạc Long Quân và Âu Cơ đã sinh ra điều kỳ diệu gì?","answer":"Bọc trăm trứng"},{"question":"Vì sao người Việt thường gọi nhau là đồng bào?","answer":"Vì cùng sinh ra từ một bọc trăm trứng"},{"question":"Sau khi các con khôn lớn, Lạc Long Quân và Âu Cơ đã chia con như thế nào?","answer":"50 con xuống biển, 50 con lên núi"},{"question":"Câu chuyện Con Rồng Cháu Tiên nhắc chúng ta điều gì?","answer":"Đoàn kết và yêu thương nhau"}]',
30)
ON DUPLICATE KEY UPDATE 
    video_url=VALUES(video_url),
    story_title=VALUES(story_title),
    story_content=VALUES(story_content),
    story_qa_json=VALUES(story_qa_json),
    piece_count=VALUES(piece_count);

-- ========================
-- PRODUCT VARIANT COMPONENT
-- ========================
INSERT INTO product_variant_component (product_variant_id, component_id, quantity, sort_order) VALUES
(1, 1, 1, 0),
(1, 2, 1, 1),
(1, 4, 1, 2)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity), sort_order=VALUES(sort_order);

-- ========================
-- PRODUCT IMAGE
-- ========================
INSERT INTO product_image (product_id, image_url, sort_order, is_primary) VALUES
(1, 'https://img.chamviet.com/crct-1.jpg', 0, 1)
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
-- Chỉ giữ 1 đơn demo
-- ========================
INSERT INTO orders (
    account_id, voucher_id, status, total_price, final_price,
    province, district, ward, address_detail, shipping_address
) VALUES
(2, NULL, 'PENDING', 229000, 229000,
 'Hà Nội', 'Hoàn Kiếm', 'Tràng Tiền', 'Số 1 Tràng Tiền',
 'Số 1 Tràng Tiền, Tràng Tiền, Hoàn Kiếm, Hà Nội')
ON DUPLICATE KEY UPDATE account_id=VALUES(account_id), voucher_id=VALUES(voucher_id), status=VALUES(status), total_price=VALUES(total_price), final_price=VALUES(final_price), province=VALUES(province), district=VALUES(district), ward=VALUES(ward), address_detail=VALUES(address_detail), shipping_address=VALUES(shipping_address);

-- ========================
-- ORDER DETAIL
-- ========================
INSERT INTO order_detail (
    order_id, product_variant_id, quantity, snapshot_price, snapshot_product_name, snapshot_variant_sku, snapshot_components_json
) VALUES
(1, 1, 1, 229000, 'Box tương tác kể chuyện', 'BOX-TTKT-01', '[{"componentId":1,"sku":"PUZ-HG-01","name":"Sự tích Hồ Gươm","componentType":"PUZZLE","quantity":1,"sortOrder":0},{"componentId":2,"sku":"PUZ-TG-01","name":"Sự tích Thánh Gióng","componentType":"PUZZLE","quantity":1,"sortOrder":1},{"componentId":4,"sku":"PG-STD-01","name":"Pepper Ghost Chuẩn","componentType":"PEPPER_GHOST","quantity":1,"sortOrder":2}]')
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
(1, 'PENDING', 'PENDING', 1, 'Khởi tạo đơn demo Box tương tác kể chuyện')
ON DUPLICATE KEY UPDATE old_status=VALUES(old_status), new_status=VALUES(new_status), changed_by=VALUES(changed_by), note=VALUES(note);

-- ========================
-- DELIVERY
-- ========================
INSERT INTO delivery (order_id, provider, tracking_code, shipping_fee, status, cod_amount, cod_status) VALUES
(1, 'GHTK', 'GHTK-DEMO-001', 30000.00, 'PENDING', 229000, 'PENDING')
ON DUPLICATE KEY UPDATE provider=VALUES(provider), tracking_code=VALUES(tracking_code), shipping_fee=VALUES(shipping_fee), status=VALUES(status), cod_amount=VALUES(cod_amount), cod_status=VALUES(cod_status);

-- ========================
-- PAYMENT
-- ========================
INSERT INTO payment (order_id, method, amount, status, transaction_ref) VALUES
(1, 'COD', 229000.00, 'PENDING', NULL)
ON DUPLICATE KEY UPDATE method=VALUES(method), amount=VALUES(amount), status=VALUES(status), transaction_ref=VALUES(transaction_ref);

-- ========================
-- INVENTORY TRANSACTION
-- ========================
INSERT INTO inventory_transaction (component_id, type, quantity, reference_id, note) VALUES
(1, 'IMPORT', 100, NULL, 'Nhập kho ban đầu puzzle Sự tích Hồ Gươm'),
(2, 'IMPORT', 100, NULL, 'Nhập kho ban đầu puzzle Sự tích Thánh Gióng'),
(3, 'IMPORT', 100, NULL, 'Nhập kho ban đầu puzzle Con Rồng Cháu Tiên'),
(4, 'IMPORT', 100, NULL, 'Nhập kho ban đầu pepper ghost'),
(1, 'RESERVE', 1, 1, 'Giữ hàng cho đơn demo #1'),
(2, 'RESERVE', 1, 1, 'Giữ hàng cho đơn demo #1'),
(4, 'RESERVE', 1, 1, 'Giữ hàng cho đơn demo #1')
ON DUPLICATE KEY UPDATE type=VALUES(type), quantity=VALUES(quantity), reference_id=VALUES(reference_id), note=VALUES(note);
