CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

CREATE TABLE `t_master_product` (
  `productId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  PRIMARY KEY (`productId`)
);

CREATE TABLE `t_history_transaksi` (
  `transactionId` int(11) NOT NULL AUTO_INCREMENT,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `type` enum('Pembelian','Penjualan') NOT NULL,
  `customerId` int(11) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transactionId`),
  KEY `productId` (`productId`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `t_history_transaksi_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `t_master_product` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `t_history_transaksi_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `t_customer` (`customerId`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `t_customer` (
  `customerId` int(11) NOT NULL AUTO_INCREMENT,
  `customerName` varchar(100) NOT NULL,
  PRIMARY KEY (`customerId`)
);

CREATE TABLE `t_history_update_stock` (
  `historyUpdateStockId` int(11) NOT NULL AUTO_INCREMENT,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `transactionType` enum('Tambah','Kurang') NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historyUpdateStockId`),
  KEY `productId` (`productId`),
  CONSTRAINT `t_history_update_stock_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `t_master_product` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION
);
