-- Clear existing data
DELETE FROM product;
DELETE FROM exchange;
DELETE FROM cart;
DELETE FROM address;
DELETE FROM category;
DELETE FROM user;

-- Users
INSERT INTO user (name, email, phone, role, registration_date, oauth_token) VALUES
('John Doe', 'john@example.com', '+1234567890', 'USER', '2024-01-01', 'google_token_1'),
('Jane Smith', 'jane@example.com', '+1987654321', 'USER', '2024-01-02', 'google_token_2'),
('Admin User', 'admin@example.com', '+1122334455', 'ADMIN', '2024-01-01', 'google_token_3'),
('Sarah Wilson', 'sarah@example.com', '+1122334466', 'USER', '2024-01-03', 'google_token_4'),
('Mike Johnson', 'mike@example.com', '+1122334477', 'USER', '2024-01-04', 'google_token_5');

-- Categories
INSERT INTO category (name, description) VALUES
('T-Shirts', 'Casual and vintage t-shirts'),
('Jeans & Pants', 'Denim, chinos, and other pants'),
('Dresses', 'Vintage and modern dresses'),
('Shoes', 'Second-hand footwear in good condition'),
('Jackets', 'Vintage jackets and coats'),
('Accessories', 'Bags, belts, and other accessories'),
('Sweaters', 'Knit and wool sweaters'),
('Skirts', 'Various styles of skirts');

-- Addresses
INSERT INTO address (street, number, city, country, postal_code, user_id) VALUES
('Main Street', '123', 'New York', 'USA', '10001', 1),
('Broadway', '456', 'Los Angeles', 'USA', '90001', 1),
('Park Avenue', '789', 'Chicago', 'USA', '60601', 2),
('Fifth Avenue', '321', 'Miami', 'USA', '33101', 3),
('Oak Street', '567', 'Boston', 'USA', '02108', 4),
('Pine Road', '890', 'Seattle', 'USA', '98101', 5),
('Cedar Lane', '234', 'San Francisco', 'USA', '94101', 2);

-- Carts (one per user)
INSERT INTO cart (cart_date, status, user_id) VALUES
('2024-03-01', 'ACTIVE', 1);

-- Exchanges (need to create these before products due to foreign key constraints)
INSERT INTO exchange (status, exchange_date, completion_date, requester_id, owner_id) VALUES
('PENDING', '2024-03-01', null, 2, 1),
('COMPLETED', '2024-03-02', '2024-03-03', 3, 2),
('PENDING', '2024-03-03', null, 4, 3),
('PENDING', '2024-03-04', null, 1, 4);

-- Products (with realistic second-hand clothing details)
INSERT INTO product (name, description, price, image, size, status, publication_date, user_id, category_id, cart_id, exchange_id) VALUES
-- T-Shirts
('Vintage Nike T-Shirt', 'Original 90s Nike t-shirt, slight wear but good condition', 29.99, 'vintage-nike.jpg', 'M', 'AVAILABLE', '2024-03-01', 1, 1, null, null),
('Retro Band T-Shirt', 'Original Rolling Stones tour shirt from 1989', 89.99, 'rolling-stones.jpg', 'L', 'SOLD', '2024-03-01', 2, 1, null, null), 
('Designer White Tee', 'Barely worn Ralph Lauren basic tee', 34.99, 'rl-white.jpg', 'S', 'PENDING_EXCHANGE', '2024-03-02', 3, 1, null, 4),

-- Jeans & Pants
('Vintage Levis 501', 'Classic 501s from the 80s, perfect fade', 79.99, 'levis-501.jpg', '32x34', 'SOLD', '2024-03-02', 1, 2, null, null), 
('Designer Jeans', 'Gently used Diesel jeans, great condition', 65.99, 'diesel-jeans.jpg', '30x32', 'PENDING_EXCHANGE', '2024-03-03', 2, 2, null, 1),
('Cargo Pants', 'Vintage military cargo pants, authentic', 45.99, 'cargo-pants.jpg', '34x34', 'AVAILABLE', '2024-03-03', 4, 2, null, null),

-- Dresses
('Vintage Floral Dress', '70s floral print dress, excellent condition', 89.99, 'vintage-dress.jpg', 'M', 'SOLD', '2024-03-02', 2, 3, null, null), 
('Cocktail Dress', 'Designer cocktail dress, worn once', 129.99, 'cocktail-dress.jpg', 'S', 'IN_CART', '2024-03-03', 3, 3, 1, null),
('Summer Maxi Dress', 'Boho style maxi dress, like new', 59.99, 'maxi-dress.jpg', 'L', 'EXCHANGED', '2024-03-04', 4, 3, null, 2),

-- Shoes
('Vintage Dr. Martens', 'Classic 1460 boots, well maintained', 89.99, 'dr-martens.jpg', '42', 'AVAILABLE', '2024-03-01', 1, 4, null, null),
('Converse All Stars', 'Rare color, lightly worn', 39.99, 'converse.jpg', '39', 'IN_CART', '2024-03-02', 2, 4, 1, null),
('Nike Air Max 90', 'Retro colorway, good condition', 69.99, 'airmax90.jpg', '44', 'PENDING_EXCHANGE', '2024-03-03', 3, 4, null, 1),

-- Jackets
('Leather Biker Jacket', 'Vintage leather jacket, natural patina', 159.99, 'leather-jacket.jpg', 'L', 'SOLD', '2024-03-01', 1, 5, null, null), 
('Denim Jacket', '90s Levis jacket, broken in perfectly', 79.99, 'denim-jacket.jpg', 'M', 'PENDING_EXCHANGE', '2024-03-02', 2, 5, null, 4),
('Winter Coat', 'Wool coat, barely used', 119.99, 'wool-coat.jpg', 'S', 'IN_CART', '2024-03-03', 3, 5, 1, null);
