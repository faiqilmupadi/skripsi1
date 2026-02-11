CREATE TABLE `users` (
  `userId` int AUTO_INCREMENT NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin_gudang','kepala_gudang') NOT NULL,
  `createdOn` datetime NOT NULL,
  `lastChange` datetime,
  `isActive` int NOT NULL DEFAULT 1,
  `deletedAt` datetime,
  CONSTRAINT `users_userId` PRIMARY KEY(`userId`),
  CONSTRAINT `users_username_unique` UNIQUE(`username`),
  CONSTRAINT `users_email_unique` UNIQUE(`email`)
);

CREATE TABLE `material_master` (
  `partNumber` varchar(50) NOT NULL,
  `materialDescription` varchar(255) NOT NULL,
  `baseUnitOfMeasure` varchar(20) NOT NULL,
  `createdOn` date NOT NULL,
  `createTime` time,
  `createdBy` varchar(100),
  `materialGroup` varchar(100),
  `isActive` int NOT NULL DEFAULT 1,
  `deletedAt` datetime,
  CONSTRAINT `material_master_partNumber` PRIMARY KEY(`partNumber`)
);

CREATE TABLE `material_stock` (
  `partNumber` varchar(50) NOT NULL,
  `plant` varchar(20) NOT NULL,
  `freeStock` decimal(10,3) NOT NULL DEFAULT '0',
  `blocked` decimal(10,3) NOT NULL DEFAULT '0',
  CONSTRAINT `material_stock_pk` PRIMARY KEY(`partNumber`,`plant`),
  CONSTRAINT `material_stock_part_fk` FOREIGN KEY (`partNumber`) REFERENCES `material_master`(`partNumber`) ON DELETE RESTRICT
);

CREATE TABLE `material_plant_data` (
  `partNumber` varchar(50) NOT NULL,
  `plant` varchar(20) NOT NULL,
  `reorderPoint` decimal(10,3) NOT NULL DEFAULT '0',
  `safetyStock` decimal(10,3) NOT NULL DEFAULT '0',
  CONSTRAINT `material_plant_data_pk` PRIMARY KEY(`partNumber`,`plant`),
  CONSTRAINT `material_plant_data_part_fk` FOREIGN KEY (`partNumber`) REFERENCES `material_master`(`partNumber`) ON DELETE RESTRICT
);

CREATE TABLE `material_movement` (
  `movementId` bigint AUTO_INCREMENT NOT NULL,
  `partNumber` varchar(50) NOT NULL,
  `plant` varchar(20) NOT NULL,
  `materialDescription` varchar(255),
  `postingDate` date NOT NULL,
  `movementType` varchar(50) NOT NULL,
  `orderNo` varchar(50),
  `purchaseOrder` varchar(50),
  `quantity` decimal(18,3) NOT NULL,
  `baseUnitOfMeasure` varchar(20),
  `userName` varchar(100),
  CONSTRAINT `material_movement_movementId` PRIMARY KEY(`movementId`),
  CONSTRAINT `material_movement_part_fk` FOREIGN KEY (`partNumber`) REFERENCES `material_master`(`partNumber`) ON DELETE RESTRICT,
  INDEX `idx_movement_postingDate` (`postingDate`),
  INDEX `idx_movement_userName` (`userName`),
  INDEX `idx_movement_partNumber` (`partNumber`),
  INDEX `idx_movement_movementType` (`movementType`),
  INDEX `idx_movement_plant` (`plant`)
);
