-- Usuarios
INSERT INTO user (user_id, email, name, oauth_token, phone, registration_date, role) VALUES
(1, 'alice@example.com', 'Alice', 'token1', '600111111', NOW(), 'USER'),
(2, 'bob@example.com', 'Bob', 'token2', '600222222', NOW(), 'ADMIN'),
(3, 'carla@example.com', 'Carla', 'token3', '600333333', NOW(), 'USER'),
(4, 'daniel@example.com', 'Daniel', 'token4', '600444444', NOW(), 'USER'),
(5, 'eva@example.com', 'Eva', 'token5', '600555555', NOW(), 'USER');

-- Direcciones
INSERT INTO address (address_id, city, country, number, postal_code, street, user_id) VALUES
(1, 'Madrid', 'España', '10', '28001', 'Gran Via', 1),
(2, 'Barcelona', 'España', '20', '08001', 'Diagonal', 2),
(3, 'Sevilla', 'España', '30', '41001', 'Alameda', 3),
(4, 'Valencia', 'España', '40', '46001', 'Colon', 4),
(5, 'Bilbao', 'España', '50', '48001', 'Indautxu', 5);

-- Categorías
INSERT INTO category (category_id, description, name) VALUES
(1, 'Electrónica y gadgets', 'Electrónica'),
(2, 'Ropa y moda', 'Moda'),
(3, 'Hogar y decoración', 'Hogar');

-- Carritos
INSERT INTO cart (cart_id, cart_date, status, user_id) VALUES
(1, NOW(), 'ACTIVE', 1),
(2, NOW(), 'PENDING', 2),
(3, NOW(), 'COMPLETED', 3),
(4, NOW(), 'ACTIVE', 4),
(5, NOW(), 'ACTIVE', 5);

-- Facturas
INSERT INTO invoice (invoice_id, invoice_date, status, total_amount, address_id, user_id) VALUES
(1, NOW(), 'PAID', 150.50, 1, 1),
(2, NOW(), 'PENDING', 89.99, 2, 2),
(3, NOW(), 'PAID', 42.00, 3, 3);

-- Intercambios
INSERT INTO exchange (exchange_id, completion_date, exchange_date, status, owner_id, requester_id) VALUES
(1, NOW(), NOW(), 'COMPLETED', 1, 2),
(2, NULL, NOW(), 'PENDING', 2, 3),
(3, NULL, NOW(), 'PENDING', 4, 5);

-- Productos (solo ropa y zapatillas)
INSERT INTO product (product_id, description, image, name, price, publication_date, size, status, cart_id, category_id, exchange_id, invoice_id, user_id) VALUES
(1, 'Camiseta negra', 'img2.jpg', 'T-Shirt', 19.99, NOW(), 'L', 'SOLD', 2, 2, 1, 1, 2),
(2, 'Zapatillas deportivas', 'img5.jpg', 'Nike Air', 75.00, NOW(), '42', 'AVAILABLE', 2, 2, NULL, NULL, 2),
(3, 'Sudadera gris', 'img8.jpg', 'Hoodie', 29.99, NOW(), 'M', 'AVAILABLE', 1, 2, NULL, NULL, 1),
(4, 'Zapatillas running', 'img6.jpg', 'Adidas Boost', 120.00, NOW(), '41', 'AVAILABLE', 4, 2, NULL, NULL, 4),
(5, 'Camiseta blanca', 'img9.jpg', 'T-Shirt Blanco', 15.00, NOW(), 'M', 'AVAILABLE', 3, 2, NULL, NULL, 3),
(6, 'Zapatillas Nike Air Max', 'img10.jpg', 'Nike Air Max', 99.99, NOW(), '43', 'AVAILABLE', 1, 2, NULL, NULL, 1),
(7, 'Pantalón de chándal', 'img11.jpg', 'Joggers', 40.00, NOW(), 'L', 'AVAILABLE', 5, 2, NULL, NULL, 5),
(8, 'Camiseta de tirantes', 'img12.jpg', 'Tank Top', 18.00, NOW(), 'S', 'AVAILABLE', 2, 2, NULL, NULL, 2),
(9, 'Pantalón corto', 'img13.jpg', 'Shorts deportivos', 22.50, NOW(), 'M', 'AVAILABLE', 3, 2, NULL, NULL, 3),
(10, 'Zapatillas deportivas Reebok', 'img14.jpg', 'Reebok Classic', 85.00, NOW(), '44', 'AVAILABLE', 4, 2, NULL, NULL, 4);
