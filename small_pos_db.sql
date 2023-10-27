-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 27-10-2023 a las 09:51:15
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cash_movements`
--

CREATE TABLE `cash_movements` (
  `cash_movement_id` int(11) NOT NULL,
  `movement_type` varchar(45) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `movement_date` datetime DEFAULT current_timestamp(),
  `cash_register_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `cash_movements`
--

INSERT INTO `cash_movements` (`cash_movement_id`, `movement_type`, `amount`, `description`, `movement_date`, `cash_register_id`, `user_id`) VALUES
(3, 'deposito', 500, 'caja inicial', '2023-10-21 20:04:51', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cash_registers`
--

CREATE TABLE `cash_registers` (
  `cash_register_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_open` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `cash_registers`
--

INSERT INTO `cash_registers` (`cash_register_id`, `name`, `is_open`, `is_active`) VALUES
(1, 'cajaTicul1', 0, 0),
(2, 'cajaTicul2', 0, 1);

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
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `create_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `customers`
--

INSERT INTO `customers` (`customer_id`, `first_name`, `last_name`, `adress`, `state`, `city`, `zip_code`, `phone_number`, `rfc`, `is_active`, `create_date`) VALUES
(1, 'Fernando', 'Aguilar', 'c 25 x 18 y 16', 'yucatan', 'ticul', '97860', '9971258563', '', 0, '2023-09-30 23:03:14'),
(2, 'Jose', 'Perez', 'c 25 x 18 y 16', 'yucatan', 'ticul', '97860', '9971258563', '', 0, '2023-09-30 23:00:36'),
(3, 'Juan', 'Rodriguez', 'c 25 x 18 y 16', 'yucatan', 'ticul', '97860', '9971258563', '', 1, '2023-10-21 18:59:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `open_close_details`
--

CREATE TABLE `open_close_details` (
  `open_close_details_id` int(11) NOT NULL,
  `open_date` datetime DEFAULT current_timestamp(),
  `open_amount` double DEFAULT NULL,
  `close_date` datetime DEFAULT NULL,
  `close_amount` double DEFAULT NULL,
  `cash_register_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `open_close_details`
--

INSERT INTO `open_close_details` (`open_close_details_id`, `open_date`, `open_amount`, `close_date`, `close_amount`, `cash_register_id`, `user_id`) VALUES
(2, '2023-09-30 23:48:20', 550, '2023-10-01 00:06:27', 100, 1, 1),
(3, '2023-10-01 00:08:59', 1000, '2023-10-21 15:11:14', 200, 1, 1),
(4, '2023-10-21 17:21:30', 500, '2023-10-21 17:36:29', 1500, 1, 1);

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
  `status` varchar(45) DEFAULT 'completado',
  `order_date` datetime DEFAULT current_timestamp(),
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`order_id`, `sub_total`, `discount`, `total`, `payment_method`, `information`, `status`, `order_date`, `customer_id`, `user_id`) VALUES
(2, 4500, 200, 4300, 'tarjeta', 'Descuento de cliente', 'completado', '2023-10-01 00:25:29', 2, 1),
(3, 150, 0, 150, 'efectivo', 'Descuento por mayoreo', 'completado', '2023-10-01 00:26:40', 2, 1),
(4, 450, 50, 400, 'tarjeta', '', 'cancelado', '2023-10-21 13:42:00', 1, 1),
(5, 450, 50, 400, 'tarjeta', '', 'completado', '2023-10-21 13:54:17', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders_details`
--

CREATE TABLE `orders_details` (
  `orders_details_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_discount` double DEFAULT NULL,
  `final_price` double DEFAULT NULL,
  `quantity` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `orders_details`
--

INSERT INTO `orders_details` (`orders_details_id`, `order_id`, `product_id`, `product_discount`, `final_price`, `quantity`) VALUES
(1, 2, 1, 2, 20, 5),
(2, 2, 2, 0, 20, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `is_variable` tinyint(1) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `purchase_price` double DEFAULT NULL,
  `sale_price` double DEFAULT NULL,
  `general_stock` double DEFAULT NULL,
  `uom` varchar(45) DEFAULT NULL,
  `image` varchar(255) DEFAULT 'NULL',
  `create_date` datetime DEFAULT current_timestamp(),
  `provider_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`product_id`, `is_variable`, `sku`, `name`, `description`, `color`, `purchase_price`, `sale_price`, `general_stock`, `uom`, `image`, `create_date`, `provider_id`, `is_active`) VALUES
(1, 1, 'hola', 'zapato', 'suela comoda de tipo piel', 'gris', 100, 150, 12, 'par', '', '2023-10-01 01:15:19', 2, 1),
(2, 0, 'hola', 'zapato', 'suela comoda de tipo piel', 'gris', 100, 150, 12, 'par', '', '2023-10-01 01:20:55', 2, 0),
(3, 0, 'hola', 'zapato naranja', 'suela comoda de tipo piel', 'naranja', 120, 180, 12, 'par', '', '2023-10-01 01:54:35', 2, 1),
(4, 0, 'hola', 'zapato naranja', 'suela comoda de tipo piel', 'naranja', 120, 180, 12, 'par', '', '2023-10-21 11:40:12', 2, 1),
(5, 0, 'hola', 'zapato naranja', 'suela comoda de tipo piel', 'naranja', 120, 180, 12, 'par', '', '2023-10-21 11:59:37', 2, 0),
(6, 1, '', 'camisa', 'camisa manga corta', 'naranja', 120, 180, 12, 'pza', '', '2023-10-21 12:18:56', 2, 1);

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
  `phone_number` varchar(15) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `create_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `providers`
--

INSERT INTO `providers` (`provider_id`, `name`, `rfc`, `zip_code`, `adress`, `state`, `city`, `phone_number`, `is_active`, `create_date`) VALUES
(1, 'Gamesa', '', '97860', 'c 19 x 42 y 44', 'yucatan', 'ticul', '', 1, '2023-10-01 01:09:54'),
(2, 'Juan Marquez', '', '97860', 'calle 25 x20 y 18', 'yucatan', 'ticul', '9971254563', 0, '2023-10-20 23:38:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `returns`
--

CREATE TABLE `returns` (
  `return_id` int(11) NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `amount_refound` double DEFAULT NULL,
  `return_date` datetime DEFAULT current_timestamp(),
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `returns`
--

INSERT INTO `returns` (`return_id`, `reason`, `amount_refound`, `return_date`, `status`, `customer_id`, `user_id`) VALUES
(1, 'Zapatos despegados', 200, '2023-10-01 01:35:08', 1, 1, 1),
(2, 'Zapato despegado y manchado', 150, '2023-10-20 22:53:16', 1, 1, 3),
(3, 'Zapato maltratado', 200, '2023-10-20 23:03:01', 1, 1, 3),
(4, 'Manchados', 100, '2023-10-20 23:12:19', 0, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `return_details`
--

CREATE TABLE `return_details` (
  `return_details_id` int(11) NOT NULL,
  `return_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(45) DEFAULT NULL,
  `quantity` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `return_details`
--

INSERT INTO `return_details` (`return_details_id`, `return_id`, `product_id`, `size`, `quantity`) VALUES
(1, 1, 3, '23', 1),
(2, 1, 3, '25', 1);

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

--
-- Volcado de datos para la tabla `sizes`
--

INSERT INTO `sizes` (`size_id`, `size`, `sku`, `stock`, `product_id`) VALUES
(4, '25', 'P03T25', 1, 3),
(5, '26', 'P03T26', 1, 3),
(6, '28', '123456', 7, 3);

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
  `create_date` datetime DEFAULT current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='		';

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `user_name`, `password`, `profile`, `position`, `adress`, `zip_code`, `state`, `city`, `phone_number`, `create_date`, `is_active`) VALUES
(1, 'eliu', 'castillo', 'ecast', '$2b$10$kaogJutEJKT5zzymQUvN8u1XIhUAgRABrbH.mXYW4HKHY2MI8jqx.', 'admin', 'gerente', 'c 25 x20 y 22', '97860', 'yucatan', 'ticul', '9974561237', '2023-09-30 23:46:05', 1),
(3, 'javier', 'alarcon', 'javi', '$2b$10$zla4e5IgtfPOAdLVEN7fMOk30WTAUs7U8EQ.3.EING6YXWccoB61O', 'admin', 'gerente', 'c 25 x20 y 22', '97860', 'yucatan', 'ticul', '9974561237', '2023-10-19 12:06:35', 1);

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
  ADD PRIMARY KEY (`orders_details_id`),
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
  ADD PRIMARY KEY (`return_details_id`),
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
  MODIFY `cash_movement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `cash_registers`
--
ALTER TABLE `cash_registers`
  MODIFY `cash_register_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `open_close_details`
--
ALTER TABLE `open_close_details`
  MODIFY `open_close_details_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `orders_details`
--
ALTER TABLE `orders_details`
  MODIFY `orders_details_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `providers`
--
ALTER TABLE `providers`
  MODIFY `provider_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `returns`
--
ALTER TABLE `returns`
  MODIFY `return_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `return_details`
--
ALTER TABLE `return_details`
  MODIFY `return_details_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sizes`
--
ALTER TABLE `sizes`
  MODIFY `size_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
