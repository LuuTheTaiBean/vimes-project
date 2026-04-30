-- XÓA BẢNG CŨ (nếu có)
DROP TABLE IF EXISTS import_receipt_details;
DROP TABLE IF EXISTS import_receipts;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS warehouses;
DROP TABLE IF EXISTS users;

-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    password VARCHAR(255),
    full_name VARCHAR(150),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SUPPLIERS
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WAREHOUSES
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    sku VARCHAR(100),
    unit VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IMPORT RECEIPTS
CREATE TABLE import_receipts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    warehouse_id INT REFERENCES warehouses(id),
    supplier_id INT REFERENCES suppliers(id),
    created_by INT REFERENCES users(id),
    import_date TIMESTAMP,
    note TEXT,
    total_amount NUMERIC,
    status VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IMPORT RECEIPT DETAILS
CREATE TABLE import_receipt_details (
    id SERIAL PRIMARY KEY,
    receipt_id INT REFERENCES import_receipts(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT,
    price NUMERIC,
    total NUMERIC
);

-- INVENTORY
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    warehouse_id INT REFERENCES warehouses(id),
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 0,
    UNIQUE (warehouse_id, product_id)
);

-- DỮ LIỆU MẪU
INSERT INTO warehouses (name, location) VALUES ('Kho A', 'HN');
INSERT INTO suppliers (name, phone) VALUES ('NCC A', '0123');
INSERT INTO products (name, sku, unit) VALUES ('Bút', 'SP01', 'cái');

-- XEM DỮ LIỆU
SELECT * FROM import_receipts ORDER BY id DESC;
SELECT * FROM import_receipt_details ORDER BY id DESC;
SELECT * FROM inventory ORDER BY id DESC;
SELECT * FROM warehouses ORDER BY id DESC;
SELECT * FROM suppliers ORDER BY id DESC;
SELECT * FROM products ORDER BY id DESC;


--XEM CHI TIẾT PHIẾU NHẬP
SELECT 
    ir.code,
    w.name AS warehouse,
    s.name AS supplier,
    p.name AS product,
    d.quantity,
    d.price,
    d.total
FROM import_receipts ir
JOIN warehouses w ON ir.warehouse_id = w.id
JOIN suppliers s ON ir.supplier_id = s.id
JOIN import_receipt_details d ON ir.id = d.receipt_id
JOIN products p ON d.product_id = p.id
ORDER BY ir.id DESC;

-- THÊM kHO
INSERT INTO warehouses (name, location) VALUES ('Kho B', 'HCM');

-- THÊM NHÀ CUNG CẤP
INSERT INTO suppliers (name, phone) VALUES ('NCC B', '0987');

-- THÊM SẢN PHẨM
INSERT INTO products (name, sku, unit) VALUES ('Khẩu trang', 'SP02', 'hộp');

-- XÓA DỮ LIỆU
TRUNCATE TABLE inventory CASCADE;
TRUNCATE TABLE import_receipt_details CASCADE;
TRUNCATE TABLE import_receipts CASCADE;
TRUNCATE TABLE warehouses CASCADE;
TRUNCATE TABLE suppliers CASCADE;
TRUNCATE TABLE products CASCADE;

-- XEM ID
SELECT id FROM warehouses;
SELECT id FROM suppliers;
SELECT id FROM products;