-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 04-10-2023 a las 10:40:20
-- Versión del servidor: 10.3.16-MariaDB
-- Versión de PHP: 7.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `small_pos_db`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`` PROCEDURE `insert_cash_movement` (IN `movement_type` VARCHAR(45), IN `amount` DOUBLE, IN `description` VARCHAR(100), IN `cash_register_id` INT, IN `user_id` INT)  insert into cash_movements (movement_type, amount, description, movement_date, cash_register_id, user_id) values (movement_type, amount, description, now(), cash_register_id, user_id)$$

CREATE DEFINER=`` PROCEDURE `insert_cash_register` (`name` VARCHAR(100), `status` TINYINT(1))  insert into cash_registers (name, status) values (name, status)$$

CREATE DEFINER=`` PROCEDURE `insert_close_details` (IN `close_amount` DOUBLE)  BEGIN
    DECLARE last_open_close_details_id int;
    
    SELECT open_close_details.open_close_details_id INTO last_open_close_details_id FROM open_close_details ORDER BY   open_close_details.open_close_details_id DESC LIMIT 1;
    
    UPDATE open_close_details
    SET open_close_details.close_date = now(), open_close_details.close_amount = close_amount
    WHERE open_close_details.open_close_details_id = last_open_close_details_id;
    
END$$

CREATE DEFINER=`` PROCEDURE `insert_customer` (IN `first_name` VARCHAR(45), IN `last_name` VARCHAR(45), IN `adress` VARCHAR(255), IN `state` VARCHAR(45), IN `city` VARCHAR(100), IN `zip_code` VARCHAR(10), IN `phone_number` VARCHAR(15), IN `rfc` VARCHAR(20))  insert into customers (first_name, last_name, adress, state, city, zip_code, phone_number, rfc, create_date) values (first_name, last_name, adress, state, city, zip_code, phone_number, rfc, now())$$

CREATE DEFINER=`` PROCEDURE `insert_open_details` (`open_amount` DOUBLE, `cash_register_id` INT, `user_id` INT)  insert into open_close_details (open_date, open_amount, cash_register_id, user_id)
VALUES (now(), open_amount, cash_register_id, user_id)$$

CREATE DEFINER=`` PROCEDURE `insert_order` (IN `sub_total` DOUBLE, IN `discount` DOUBLE, IN `total` DOUBLE, IN `payment_method` VARCHAR(45), IN `information` VARCHAR(255), IN `status` VARCHAR(45), IN `customer_id` INT, IN `user_id` INT)  insert into orders (sub_total, discount, total, payment_method, information, status, order_date, customer_id, user_id)
VALUES (sub_total, discount, total, payment_method, information, status, now(), customer_id, user_id)$$

CREATE DEFINER=`` PROCEDURE `insert_order_details` (`order_id` INT, `product_id` INT, `product_discount` DOUBLE, `final_price` DOUBLE, `quantity` DOUBLE)  insert into orders_details (order_id, product_id, product_discount, final_price, quantity)
values (order_id, product_id, product_discount, final_price, quantity)$$

CREATE DEFINER=`` PROCEDURE `insert_product` (`variable_product` TINYINT(1), `sku` VARCHAR(255), `name` VARCHAR(100), `description` VARCHAR(255), `color` VARCHAR(45), `purchase_price` DOUBLE, `sale_price` DOUBLE, `general_stock` DOUBLE, `uom` VARCHAR(45), `image` VARCHAR(255), `provider_id` INT)  insert into products (variable_product, sku, name, description, color, purchase_price, sale_price, general_stock, uom, image, create_date, provider_id)
VALUES (variable_product, sku, name, description, color, purchase_price, sale_price, general_stock, uom, image, now(), provider_id)$$

CREATE DEFINER=`` PROCEDURE `insert_provider` (`name` VARCHAR(150), `rfc` VARCHAR(20), `zip_code` VARCHAR(10), `adress` VARCHAR(255), `state` VARCHAR(45), `city` VARCHAR(100))  insert into providers (name, rfc, zip_code, adress, state, city, create_date)
values (name, rfc, zip_code, adress, state, city, now())$$

CREATE DEFINER=`` PROCEDURE `insert_return` (`reason` VARCHAR(100), `amount_refound` DOUBLE, `customer_id` INT, `user_id` INT)  insert into returns (reason, amount_refound, return_date, customer_id, user_id)
values (reason, amount_refound, now(), customer_id, user_id)$$

CREATE DEFINER=`` PROCEDURE `insert_return_details` (IN `return_id` INT, IN `product_id` INT, IN `size` VARCHAR(45), IN `quantity` DOUBLE)  insert into return_details(return_id,product_id,size,quantity)
VALUES (return_id,product_id,size,quantity)$$

CREATE DEFINER=`` PROCEDURE `insert_size` (`size` VARCHAR(10), `sku` VARCHAR(255), `stock` DOUBLE, `product_id` INT)  insert into sizes (size, sku, stock, product_id)
values (size, sku, stock, product_id)$$

CREATE DEFINER=`` PROCEDURE `insert_user` (IN `first_name` VARCHAR(45), IN `last_name` VARCHAR(45), IN `user_name` VARCHAR(45), IN `password` VARCHAR(255), IN `profile` VARCHAR(45), IN `position` VARCHAR(45), IN `adress` VARCHAR(255), IN `zip_code` VARCHAR(10), IN `state` VARCHAR(45), IN `city` VARCHAR(45), IN `phone_number` VARCHAR(15))  INSERT INTO users (first_name, last_name, user_name, password, profile, position, adress, zip_code, state, city, phone_number, create_date)
VALUES (first_name, last_name, user_name, password, profile, position, adress, zip_code, state, city, phone_number, now())$$

CREATE DEFINER=`` PROCEDURE `update_cash_movement` (`cash_movement_id` INT, `movement_type` VARCHAR(45), `amount` DOUBLE, `description` VARCHAR(255), `cash_register_id` INT, `user_id` INT)  update cash_movements set cash_movements.movement_type=movement_type, cash_movements.amount=amount, cash_movements.description=description, cash_movements.cash_register_id = cash_register_id, cash_movements.user_id=user_id
WHERE cash_movements.cash_movement_id=cash_movement_id$$

CREATE DEFINER=`` PROCEDURE `update_cash_register` (`cash_register_id` INT, `name` VARCHAR(100), `status` TINYINT(1))  UPDATE cash_registers set cash_registers.name = name, cash_registers.status=status
WHERE cash_registers.cash_register_id=cash_register_id$$

CREATE DEFINER=`` PROCEDURE `update_customer` (`customer_id` INT, `first_name` VARCHAR(45), `last_name` VARCHAR(45), `adress` VARCHAR(255), `state` VARCHAR(45), `city` VARCHAR(100), `zip_code` VARCHAR(10), `phone_number` VARCHAR(15), `rfc` VARCHAR(20))  UPDATE customers
SET customers.first_name = first_name, customers.last_name = last_name, customers.adress = adress, customers.state = state, customers.city = city, customers.zip_code = zip_code, customers.phone_number = phone_number, customers.rfc = rfc
WHERE customers.customer_id = customer_id$$

CREATE DEFINER=`` PROCEDURE `update_order` (`order_id` INT, `sub_total` DOUBLE, `discount` DOUBLE, `total` DOUBLE, `payment_method` VARCHAR(45), `information` VARCHAR(255), `status` VARCHAR(45), `customer_id` INT, `user_id` INT)  update orders
SET orders.sub_total=sub_total, orders.discount = discount, orders.total = total, orders.payment_method = payment_method, orders.information = information, orders.status = status, orders.customer_id = customer_id, orders.user_id = user_id
WHERE orders.order_id = order_id$$

CREATE DEFINER=`` PROCEDURE `update_order_details` (`order_id` INT, `product_id` INT, `product_discount` DOUBLE, `final_price` DOUBLE, `quantity` DOUBLE)  update orders_details
set orders_details.product_discount = product_discount, orders_details.final_price = final_price, orders_details.quantity = quantity
where orders_details.order_id = order_id and orders_details.product_id = product_id$$

CREATE DEFINER=`` PROCEDURE `update_product` (`product_id` INT, `variable_product` TINYINT(1), `sku` VARCHAR(255), `name` VARCHAR(100), `description` VARCHAR(255), `color` VARCHAR(45), `purchase_price` DOUBLE, `sale_price` DOUBLE, `general_stock` DOUBLE, `uom` VARCHAR(45), `image` VARCHAR(255), `provider_id` INT)  update products
set products.variable_product = variable_product, products.sku = sku, products.name = name, products.description = description, products.color = color, products.purchase_price = purchase_price, products.sale_price = sale_price, products.general_stock = general_stock, products.uom = uom, products.image = image, products.provider_id = provider_id
where products.product_id = product_id$$

CREATE DEFINER=`` PROCEDURE `update_provider` (`provider_id` INT, `name` VARCHAR(150), `rfc` VARCHAR(20), `zip_code` VARCHAR(10), `adress` VARCHAR(255), `state` VARCHAR(45), `city` VARCHAR(100))  update providers
set providers.name=name, providers.rfc=rfc, providers.zip_code=zip_code, providers.adress = adress, providers.state=state, providers.city=city
where providers.provider_id=provider_id$$

CREATE DEFINER=`` PROCEDURE `update_size` (IN `size_id` INT, IN `size` VARCHAR(10), IN `sku` VARCHAR(255), IN `stock` DOUBLE, IN `product_id` INT)  update sizes
set sizes.size=size, sizes.sku = sku, sizes.stock = stock, sizes.product_id = product_id
WHERE sizes.size_id = size_id$$

CREATE DEFINER=`` PROCEDURE `update_user` (IN `user_id` INT, IN `first_name` VARCHAR(45), IN `last_name` VARCHAR(45), IN `user_name` VARCHAR(45), IN `password` VARCHAR(255), IN `profile` VARCHAR(45), IN `position` VARCHAR(45), IN `adress` VARCHAR(255), IN `zip_code` VARCHAR(10), IN `state` VARCHAR(45), IN `city` VARCHAR(45), IN `phone_number` VARCHAR(15))  UPDATE users
SET users.first_name=first_name, users.last_name=last_name, users.user_name=user_name, users.password = password, users.profile = profile, users.position = position, users.adress = adress, users.zip_code = zip_code, users.state = state, users.city = city, users.phone_number = phone_number
WHERE users.user_id = user_id$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cash_movements`
--

CREATE TABLE `cash_movements` (
  `cash_movement_id` int(11) NOT NULL,
  `movement_type` varchar(45) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `movement_date` datetime DEFAULT NULL,
  `cash_register_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cash_registers`
--

CREATE TABLE `cash_registers` (
  `cash_register_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `adress` varchar(255) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `rfc` varchar(20) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `open_close_details`
--

CREATE TABLE `open_close_details` (
  `open_close_details_id` int(11) NOT NULL,
  `open_date` datetime DEFAULT NULL,
  `open_amount` double DEFAULT NULL,
  `close_date` datetime DEFAULT NULL,
  `close_amount` double DEFAULT NULL,
  `cash_register_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `sub_total` double DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `total` double DEFAULT NULL,
  `payment_method` varchar(45) DEFAULT NULL,
  `information` varchar(255) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders_details`
--

CREATE TABLE `orders_details` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_discount` double DEFAULT NULL,
  `final_price` double DEFAULT NULL,
  `quantity` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `variable_product` tinyint(1) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `purchase_price` double DEFAULT NULL,
  `sale_price` double DEFAULT NULL,
  `general_stock` double DEFAULT NULL,
  `uom` varchar(45) DEFAULT NULL,
  `image` varchar(255) DEFAULT 'NULL',
  `create_date` datetime DEFAULT NULL,
  `provider_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `providers`
--

CREATE TABLE `providers` (
  `provider_id` int(11) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `rfc` varchar(20) DEFAULT 'NULL',
  `zip_code` varchar(10) DEFAULT NULL,
  `adress` varchar(255) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `returns`
--

CREATE TABLE `returns` (
  `return_id` int(11) NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `amount_refound` double DEFAULT NULL,
  `return_date` datetime DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `return_details`
--

CREATE TABLE `return_details` (
  `return_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(45) DEFAULT NULL,
  `quantity` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sizes`
--

CREATE TABLE `sizes` (
  `size_id` int(11) NOT NULL,
  `size` varchar(10) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `stock` double DEFAULT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `user_name` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile` varchar(45) DEFAULT NULL,
  `position` varchar(45) DEFAULT NULL,
  `adress` varchar(255) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='		';

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cash_movements`
--
ALTER TABLE `cash_movements`
  ADD PRIMARY KEY (`cash_movement_id`),
  ADD KEY `cash_register_id` (`cash_register_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `cash_registers`
--
ALTER TABLE `cash_registers`
  ADD PRIMARY KEY (`cash_register_id`);

--
-- Indices de la tabla `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indices de la tabla `open_close_details`
--
ALTER TABLE `open_close_details`
  ADD PRIMARY KEY (`open_close_details_id`),
  ADD KEY `cash_register_id` (`cash_register_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `orders_details`
--
ALTER TABLE `orders_details`
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `Orders_order_id` (`order_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indices de la tabla `providers`
--
ALTER TABLE `providers`
  ADD PRIMARY KEY (`provider_id`);

--
-- Indices de la tabla `returns`
--
ALTER TABLE `returns`
  ADD PRIMARY KEY (`return_id`),
  ADD KEY `customer_id` (`customer_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `return_details`
--
ALTER TABLE `return_details`
  ADD PRIMARY KEY (`return_id`,`product_id`),
  ADD KEY `return_id` (`return_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`size_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cash_movements`
--
ALTER TABLE `cash_movements`
  MODIFY `cash_movement_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cash_registers`
--
ALTER TABLE `cash_registers`
  MODIFY `cash_register_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `open_close_details`
--
ALTER TABLE `open_close_details`
  MODIFY `open_close_details_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `providers`
--
ALTER TABLE `providers`
  MODIFY `provider_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `returns`
--
ALTER TABLE `returns`
  MODIFY `return_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sizes`
--
ALTER TABLE `sizes`
  MODIFY `size_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cash_movements`
--
ALTER TABLE `cash_movements`
  ADD CONSTRAINT `cash_movements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `cash_movements_ibfk_2` FOREIGN KEY (`cash_register_id`) REFERENCES `cash_registers` (`cash_register_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `open_close_details`
--
ALTER TABLE `open_close_details`
  ADD CONSTRAINT `open_close_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `open_close_details_ibfk_2` FOREIGN KEY (`cash_register_id`) REFERENCES `cash_registers` (`cash_register_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `orders_details`
--
ALTER TABLE `orders_details`
  ADD CONSTRAINT `orders_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_details_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`provider_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `returns`
--
ALTER TABLE `returns`
  ADD CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `returns_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `return_details`
--
ALTER TABLE `return_details`
  ADD CONSTRAINT `return_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `return_details_ibfk_2` FOREIGN KEY (`return_id`) REFERENCES `returns` (`return_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `sizes`
--
ALTER TABLE `sizes`
  ADD CONSTRAINT `sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
