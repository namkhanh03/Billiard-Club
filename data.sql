-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: billiardshop
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `billiard_table`
--

DROP TABLE IF EXISTS `billiard_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billiard_table` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `table_type` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `facility_id` bigint DEFAULT NULL,
  `pricing_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5fhgany5r4w05tb98n3c56mrd` (`facility_id`),
  KEY `FK5fkwjw2jk2eo4rldxbbmxkfwv` (`pricing_id`),
  CONSTRAINT `FK5fhgany5r4w05tb98n3c56mrd` FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`),
  CONSTRAINT `FK5fkwjw2jk2eo4rldxbbmxkfwv` FOREIGN KEY (`pricing_id`) REFERENCES `pricing` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billiard_table`
--

LOCK TABLES `billiard_table` WRITE;
/*!40000 ALTER TABLE `billiard_table` DISABLE KEYS */;
INSERT INTO `billiard_table` VALUES (1,'2025-03-14 04:32:08.638186',_binary '',_binary '\0','Bàn TDB1','Available','Basic','2025-04-22 23:07:04.171635',4,1),(2,'2025-03-14 04:39:51.767475',_binary '',_binary '\0','Bàn TDB2','Available','Basic','2025-04-01 04:18:31.316766',4,1),(3,'2025-03-14 04:40:08.671329',_binary '',_binary '\0','Bàn TDB3','Available','Basic','2025-04-22 23:13:22.039927',4,1),(4,'2025-03-14 04:40:18.253532',_binary '',_binary '\0','Bàn TDS1','Available','Standard','2025-04-01 04:18:23.808445',4,1),(5,'2025-03-14 04:40:27.977314',_binary '',_binary '\0','Bàn TDS2','Available','Standard','2025-04-19 05:44:41.345955',4,9),(6,'2025-03-14 04:40:39.090577',_binary '',_binary '\0','Bàn TDS3','Available','Standard','2025-04-19 03:26:40.726642',4,1),(7,'2025-03-14 04:40:53.490816',_binary '',_binary '\0','Bàn TDV1','Available','VIP','2025-04-19 05:41:50.601080',4,1),(8,'2025-03-14 04:41:05.541326',_binary '',_binary '\0','Bàn TDV2','Available','VIP','2025-04-22 22:46:07.192357',4,1),(9,'2025-03-14 04:41:15.487551',_binary '',_binary '\0','Bàn TDV3','Available','VIP','2025-04-19 03:33:00.784766',4,1),(10,'2025-03-14 04:51:10.823085',_binary '',_binary '\0','Bàn BTV1','Available','VIP','2025-04-01 04:26:38.824600',8,10),(11,'2025-03-14 04:51:20.284712',_binary '',_binary '\0','Bàn BTV2','Available','VIP','2025-04-01 04:26:35.705679',8,10),(12,'2025-03-14 04:52:10.832830',_binary '',_binary '\0','Bàn BTV3','Available','VIP','2025-04-01 04:26:32.578022',8,10),(13,'2025-03-14 09:40:01.370507',_binary '',_binary '\0','Bàn PNV1','Available','Basic','2025-04-16 00:54:43.261137',3,9),(14,'2025-04-08 21:09:50.852345',_binary '',_binary '','123','Available',NULL,'2025-04-16 02:04:18.568292',14,9);
/*!40000 ALTER TABLE `billiard_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'2025-03-13 12:17:59.357290','Cà phê','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/fe18cd73-13a1-46bf-becc-044bb2195021_6.jpg?alt=media',_binary '\0','Cà phê','2025-03-13 12:17:59.357290'),(2,'2025-03-13 12:18:11.421491','Trà sữa','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/285674d1-3d9b-487a-a3f7-095a2101d6ef_1.jpg?alt=media',_binary '\0','Trà sữa','2025-03-13 12:18:11.421491'),(3,'2025-03-13 12:18:26.028884','Trà trái cây','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/719c8070-f820-4f9c-9e98-480b68546e48_2.jpg?alt=media',_binary '\0','Trà trái cây','2025-03-13 12:18:26.028884'),(4,'2025-03-13 12:18:45.488011','Mì xào','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/7e1c4596-0f82-48c2-89e4-77e8b2d1c46e_2.jpg?alt=media',_binary '\0','Mì xào','2025-03-13 12:18:45.488011'),(5,'2025-03-13 12:19:01.959385','Cơm chiên','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/cf217cf4-a172-4381-ae44-b26481feff03_2.jpg?alt=media',_binary '\0','Cơm chiên','2025-03-13 12:19:01.960402'),(6,'2025-03-14 06:50:36.371059','Nước giải khát','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/230195e1-200e-4ee3-a3bf-2252cb13856e_6.jpg?alt=media',_binary '\0','Nước giải khát','2025-03-17 12:56:30.380390');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drink_food`
--

DROP TABLE IF EXISTS `drink_food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drink_food` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `warning_threshold` int DEFAULT NULL,
  `facility_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcsjrt64m6na7m9pt8mcw53kmu` (`category_id`),
  KEY `FK5ym60827br099g4vaerb1sygc` (`facility_id`),
  CONSTRAINT `FK5ym60827br099g4vaerb1sygc` FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`),
  CONSTRAINT `FKcsjrt64m6na7m9pt8mcw53kmu` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drink_food`
--

LOCK TABLES `drink_food` WRITE;
/*!40000 ALTER TABLE `drink_food` DISABLE KEYS */;
INSERT INTO `drink_food` VALUES (1,'2025-03-14 05:37:46.722681','Mì xào xúc xích','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/a4a06a46-e3f1-45a5-90ac-5edfa9d98647_3.jpg?alt=media',_binary '',_binary '\0','Mì xào xúc xích',65000,'2025-04-19 06:18:30.344366',4,64,20,4),(2,'2025-03-14 06:51:02.152981','Cocacola','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/bac30b86-efa5-4ff4-9d50-f13f0badd494_1.jpg?alt=media',_binary '',_binary '\0','Cocacola',15000,'2025-04-10 08:20:45.218367',6,237,15,4),(3,'2025-03-14 06:51:23.701930','Sting','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/6e4bf151-c258-4e3d-9501-ce2cc94fb26b_2.jpg?alt=media',_binary '',_binary '\0','Sting',15000,'2025-04-10 08:20:32.680404',6,191,20,4),(4,'2025-03-14 06:51:49.077026','Bò húc','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/f9179114-fb46-4179-9d74-2535b1f921d8_3.jpg?alt=media',_binary '',_binary '\0','Bò húc',15000,'2025-04-10 08:21:12.689650',6,150,20,14),(5,'2025-03-14 06:52:06.700075','Fanta','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/c40dee28-7d01-459c-b40c-f776bf863c8d_4.jpg?alt=media',_binary '',_binary '\0','Fanta',15000,'2025-04-10 08:21:08.727434',6,100,20,8),(6,'2025-03-14 06:53:08.696109','Revive','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/c32afdee-ec66-4bb2-8848-aa73a170fcd8_5.jpg?alt=media',_binary '',_binary '\0','Revive',15000,'2025-04-19 06:18:23.886781',6,76,20,4),(7,'2025-03-14 06:58:04.086418','Cơm chiên hải sản','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/63043d4e-84d7-47d2-a746-145830f8c65f_1.jpg?alt=media',_binary '',_binary '\0','Cơm chiên hải sản',70000,'2025-04-16 00:08:52.658234',5,28,10,4);
/*!40000 ALTER TABLE `drink_food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facility`
--

DROP TABLE IF EXISTS `facility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facility` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facility`
--

LOCK TABLES `facility` WRITE;
/*!40000 ALTER TABLE `facility` DISABLE KEYS */;
INSERT INTO `facility` VALUES (1,'99 Nguyễn Xí, , 765, 79','2025-03-13 16:36:06.739434',_binary '',_binary '','Chi nhánh Bình Thạnh','undefined','2025-03-13 16:36:06.739434'),(2,'659 Quan Trung, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh','2025-03-13 16:43:29.856868',_binary '',_binary '','Chi nhánh Gò Vấp','0987 321 456','2025-03-17 13:57:13.230530'),(3,'174 Phan Đăng Lưu, Phường 4, Quận Phú Nhuận, Thành phố Hồ Chí Minh','2025-03-13 16:44:52.034922',_binary '',_binary '\0','Chi nhánh Phú Nhuận','0987 456 123','2025-03-17 13:54:58.926347'),(4,'92 Xuân Thủy, Phường Thảo Điền, Thành phố Thủ Đức, Thành phố Hồ Chí Minh','2025-03-13 16:45:38.230297',_binary '',_binary '\0','Chi Nhánh Thủ Đức','0987 123 456','2025-04-08 21:08:07.776006'),(8,'99 Nguyễn Xí, Phường 26, Quận Bình Thạnh, Thành phố Hồ Chí Minh','2025-03-13 16:59:46.443276',_binary '',_binary '\0','Chi nhánh Bình Thạnh','0987 654 321','2025-03-31 23:52:24.024041'),(9,'92 Xuân Thủy, Phường Thảo Điền, Thành phố Thủ Đức, Thành phố Hồ Chí Minh','2025-03-13 17:00:06.880851',_binary '',_binary '\0','Chi Nhánh Thủ Đức','0987 654 321','2025-04-22 22:08:01.649575'),(10,'34 Cộng Hòa, Phường 12, Quận Tân Bình, Thành phố Hồ Chí Minh','2025-03-17 13:25:12.821219',_binary '',_binary '\0','Chi nhánh Tân Bình','091237126','2025-04-01 00:58:43.172377'),(12,'105 Nguyễn Đức Cảnh, Phường Tân Phong, Quận 7, Thành phố Hồ Chí Minh','2025-04-08 02:41:51.391628',_binary '',_binary '','Chi nhánh Quận 7','0926 123 211','2025-04-08 02:41:51.391628'),(13,'11 Sư Vạn Hạnh, Phường 12, Quận 10, Thành phố Hồ Chí Minh','2025-04-08 02:42:43.802036',_binary '',_binary '\0','Chi nhánh quận 10','0977 123 234','2025-04-08 02:42:43.802036'),(14,'31Bis Mạc Đỉnh Chi, Phường Đa Kao, Quận 1, Thành phố Hồ Chí Minh','2025-04-08 02:43:47.776372',_binary '',_binary '','Chi nhánh Quận 1','0997 236 753','2025-04-08 02:43:47.776372');
/*!40000 ALTER TABLE `facility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facility_image`
--

DROP TABLE IF EXISTS `facility_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facility_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `facility_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnrx8tu5s53v5tutiyv2sxw01d` (`facility_id`),
  CONSTRAINT `FKnrx8tu5s53v5tutiyv2sxw01d` FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facility_image`
--

LOCK TABLES `facility_image` WRITE;
/*!40000 ALTER TABLE `facility_image` DISABLE KEYS */;
INSERT INTO `facility_image` VALUES (15,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/e9f96e96-fea3-4305-98e7-ef3dbea9d67f_4.jpg?alt=media',3),(18,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/7cf7ad4d-bf32-4f47-a153-c2b4c66723e8_1.jpg?alt=media',2),(22,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/9762a38b-5d55-4171-9a4f-b402c6b5d02c_2.jpg?alt=media',4),(23,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/bf4ea2d4-12c2-4fd9-8d42-c89f14f3fc0e_3.jpg?alt=media',4),(24,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/7c299298-8d72-4878-8c12-a13f837075e2_4.jpg?alt=media',4),(25,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/ffa462cc-39e0-43c1-b072-68c205a67061_1.jpg?alt=media',8),(47,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/48c545aa-fe41-474e-8b9c-c717ee60e3ea_2.jpg?alt=media',10),(48,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/45d56963-1ca4-4809-aa88-d2a496ff6b55_1.jpg?alt=media',10),(49,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/7a483763-b49a-42b2-9c32-eb1b91e8f257_5.jpg?alt=media',12),(50,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/99a94f82-f95c-4033-ab69-3946a23d0a11_6.jpg?alt=media',13),(51,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/e2d2f840-8a2e-420f-b25b-c806bad98926_7.jpg?alt=media',14),(52,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/eb956bed-13a8-4f49-a14f-6ec328926814_7.jpg?alt=media',4),(53,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/8de74814-7d10-4a36-ad5f-7d06341b0013_455832211_899865755508566_560198364815728377_n.jpg?alt=media',9);
/*!40000 ALTER TABLE `facility_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facility_user`
--

DROP TABLE IF EXISTS `facility_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facility_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_at` datetime(6) DEFAULT NULL,
  `facility_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKr6rr6w40ooswomm7x66nje495` (`facility_id`),
  KEY `FK5c6pisnvyg4qkvu4ncc4m0gae` (`user_id`),
  CONSTRAINT `FK5c6pisnvyg4qkvu4ncc4m0gae` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKr6rr6w40ooswomm7x66nje495` FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facility_user`
--

LOCK TABLES `facility_user` WRITE;
/*!40000 ALTER TABLE `facility_user` DISABLE KEYS */;
INSERT INTO `facility_user` VALUES (6,'2025-03-20 21:19:30.284941',3,2),(7,'2025-03-20 21:19:30.284941',4,2),(8,'2025-03-20 21:19:30.284941',8,2),(47,'2025-04-19 00:11:39.996031',2,3),(48,'2025-04-19 00:11:39.996031',4,3),(49,'2025-04-19 00:11:39.996031',8,3),(50,'2025-04-19 00:11:39.996031',12,3);
/*!40000 ALTER TABLE `facility_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `income_expense`
--

DROP TABLE IF EXISTS `income_expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `income_expense` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `facility_id` bigint DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7dyl76ka6bpi9b03smb12e12o` (`created_by`),
  KEY `FK9dguf39w3xg5ipq9lnr2a9awu` (`facility_id`),
  CONSTRAINT `FK7dyl76ka6bpi9b03smb12e12o` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FK9dguf39w3xg5ipq9lnr2a9awu` FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `income_expense`
--

LOCK TABLES `income_expense` WRITE;
/*!40000 ALTER TABLE `income_expense` DISABLE KEYS */;
INSERT INTO `income_expense` VALUES (1,125000,'2025-03-21 00:15:07.191632','2025-03-20','Hong biết\n','Income','2025-03-21 15:02:33.574269',3,4,_binary '\0',NULL),(2,50000,'2025-03-21 00:28:03.106466','2025-03-20','Mua bao tay','Expense','2025-03-21 00:28:03.106466',3,8,_binary '\0',NULL),(3,35000,'2025-03-21 14:32:11.605128','2025-03-21','Mua phấn','Expense','2025-03-21 15:02:26.518340',3,8,_binary '\0',NULL),(4,50000,'2025-04-01 04:27:15.919700','2025-04-01','Mua đồ','Expense','2025-04-01 05:34:20.697709',1,3,_binary '\0','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/35e5d3be-49da-4db1-8865-d998eaa5e24e_project999.png?alt=media'),(5,50000,'2025-04-01 04:27:22.965150','2025-04-01','Mua đồ dùng','Expense','2025-04-01 05:34:09.618523',1,3,_binary '\0','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/6ac1cfbe-fb38-484c-a94f-6d13a995af0a_hoa_don_ban_hang_pdf.pdf?alt=media'),(6,170000,'2025-04-01 05:08:39.052742','2025-04-01','Mua bao tay','Income','2025-04-01 05:08:39.052742',1,3,_binary '','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/income_expenses/ca91aa3a-507b-4033-906c-0e1982e821d9_hoa_don_ban_hang_pdf.pdf?alt=media'),(7,110000,'2025-04-01 05:27:38.394329','2025-04-01','Mua đồ ăn','Expense','2025-04-01 05:27:38.394329',1,3,_binary '','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/upload/d0c86d7a-9819-451d-82e3-0b2536584a9d_hoa_don_ban_hang_pdf.pdf?alt=media'),(8,110000,'2025-04-01 05:28:41.803832','2025-04-01','Mua đồ ăn','Expense','2025-04-01 05:28:41.803832',1,3,_binary '','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/upload/fb756698-8c5c-4571-8553-e2c569b829c8_DATABASE.png?alt=media'),(9,110000,'2025-04-01 05:30:16.718006','2025-04-01','Mua đồ ăn','Expense','2025-04-01 05:30:16.718006',1,3,_binary '\0','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/47f2618f-7651-418b-bd28-181c05189e7c_ClassDiagram.jpg?alt=media'),(10,130000,'2025-04-01 05:31:55.748030','2025-04-01','Bán đồ cũ','Income','2025-04-01 05:31:55.748030',1,3,_binary '\0','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/92136e35-dc5c-4ce2-8659-159cd6dbaf2c_hoa_don_ban_hang_pdf.pdf?alt=media');
/*!40000 ALTER TABLE `income_expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `unit_price` int DEFAULT NULL,
  `drink_id` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6siwt893smrsuvgooypqrh49` (`drink_id`),
  KEY `FKrws2q0si6oyd6il8gqe2aennc` (`order_id`),
  CONSTRAINT `FK6siwt893smrsuvgooypqrh49` FOREIGN KEY (`drink_id`) REFERENCES `drink_food` (`id`),
  CONSTRAINT `FKrws2q0si6oyd6il8gqe2aennc` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (1,1,15000,3,12),(2,1,15000,6,12),(3,1,70000,7,12),(4,1,65000,1,12),(5,1,15000,3,13),(6,1,15000,6,13),(7,1,70000,7,13),(8,1,65000,1,13),(9,1,70000,7,14),(10,1,15000,6,14),(11,1,15000,3,14),(12,1,70000,7,15),(13,1,15000,2,15),(14,1,65000,1,15),(15,1,15000,2,16),(16,3,65000,1,16);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `total_amount` int DEFAULT NULL,
  `customer_user_id` bigint DEFAULT NULL,
  `table_id` bigint DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `play_duration` bigint DEFAULT NULL,
  `staff_id` bigint DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8fvgue6769ma18to0aiv8f54s` (`customer_user_id`),
  KEY `FK62jgopa86tqlyfkfu9w4pqn75` (`table_id`),
  KEY `FKt00kinkf6xry4b0h9k5wum1tx` (`staff_id`),
  CONSTRAINT `FK62jgopa86tqlyfkfu9w4pqn75` FOREIGN KEY (`table_id`) REFERENCES `billiard_table` (`id`),
  CONSTRAINT `FK8fvgue6769ma18to0aiv8f54s` FOREIGN KEY (`customer_user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKt00kinkf6xry4b0h9k5wum1tx` FOREIGN KEY (`staff_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (12,'2025-04-22 22:44:40.449406','2025-04-22 23:59:21.649000','2025-04-22 22:43:33.203000',165000,NULL,8,'Chuyển khoản',75,1,'0916235122'),(13,'2025-04-22 22:44:47.426715','2025-04-22 23:59:21.649000','2025-04-22 22:43:33.203000',165000,2,8,'Chuyển khoản',75,1,NULL),(14,'2025-04-22 22:46:07.154354','2025-04-22 23:19:51.932000','2025-04-22 22:45:37.321000',173667,2,8,'Chuyển khoản',34,1,NULL),(15,'2025-04-22 23:07:04.136634','2025-04-22 23:13:58.512000','2025-04-22 23:06:52.614000',165167,NULL,1,'Chuyển khoản',7,1,'0731612311'),(16,'2025-04-22 23:13:22.015927','2025-04-22 23:37:07.496000','2025-04-22 23:13:59.068000',259833,NULL,3,'Chuyển khoản',23,1,'0976125123');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `payment_date` datetime(6) DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `reservation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrewpj5f9v9xehy4ga8g221nw1` (`reservation_id`),
  CONSTRAINT `FKrewpj5f9v9xehy4ga8g221nw1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` longtext,
  `created_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `posted_by` bigint DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2wntmv8ldfdgyjsd07ipbh5wn` (`posted_by`),
  CONSTRAINT `FK2wntmv8ldfdgyjsd07ipbh5wn` FOREIGN KEY (`posted_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,'<p class=\"description\">B&ecirc;n cạnh c&aacute;c cơ thủ Việt Nam, giải Billiards Carom 3 băng Quốc tế B&igrave;nh Dương tranh Cup BTV &ndash; Becamex IJC c&ograve;n c&oacute; sự g&oacute;p mặt của bốn VĐV h&agrave;ng đầu thế giới.</p>\r\n<article class=\"fck_detail \">\r\n<p class=\"Normal\">Trong số c&aacute;c cơ thủ nước ngo&agrave;i, c&oacute; hai người đến từ H&agrave;n Quốc l&agrave; Cho Jea Ho v&agrave; Kang Dong Koong từng tham dự giải lần trước. Cho Jea Ho đ&atilde; v&ocirc; địch World Cup tại Istanbul, Thổ Nhĩ Kỳ năm 2014, v&agrave; hiện tại xếp thứ s&aacute;u thế giới - cao hơn ba bậc so với Kang Dong Koong.</p>\r\n<p class=\"Normal\">Ngo&agrave;i ra c&ograve;n c&oacute; hai cơ thủ Nhật Bản l&agrave; Suzuki Tsuyoshi v&agrave; Arai Tatsuo. Người đầu ti&ecirc;n từng gi&agrave;nh huy chương v&agrave;ng Carom 3 băng tại Asiad 2010, c&ograve;n người thứ hai đ&atilde; hai lần đến Việt Nam dự giải.</p>\r\n<figure class=\"tplCaption action_thumb_added\" itemprop=\"associatedMedia image\" itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" data-size=\"js\">\r\n<div class=\"fig-picture el_valid\" style=\"margin: 0px; padding: 0px 0px 323.75px; box-sizing: border-box; text-rendering: optimizelegibility; width: 680px; float: left; display: table; -webkit-box-pack: center; justify-content: center; background: #f0eeea; text-align: center; position: relative;\" data-src=\"https://i1-thethao.vnecdn.net/2015/07/22/Bida-5210-1433837032-8013-1437531496.jpg?w=0&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=1ZcuCCcx83IUEuzaCkrjEA\" data-sub-html=\"&lt;div class=&quot;ss-wrapper&quot;&gt;&lt;div class=&quot;ss-content&quot;&gt;\r\n&lt;p class=&quot;Image&quot;&gt;\r\nTay cơ M&atilde; Minh Cẩm c&oacute; thế mạnh carom một băng nhưng anh vẫn mạnh dạn thử sức ở giải carom ba băng lần n&agrave;y. Ảnh: &lt;em&gt;Đức Đồng.&lt;/em&gt;&lt;/p&gt;\r\n&lt;/div&gt;&lt;/div&gt;\"><picture><source srcset=\"https://i1-thethao.vnecdn.net/2015/07/22/Bida-5210-1433837032-8013-1437531496.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=hTwKwO6LIUxzN9_63VP6lQ\" data-srcset=\"https://i1-thethao.vnecdn.net/2015/07/22/Bida-5210-1433837032-8013-1437531496.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=hTwKwO6LIUxzN9_63VP6lQ\"><img class=\"lazy lazied\" itemprop=\"contentUrl\" src=\"https://i1-thethao.vnecdn.net/2015/07/22/Bida-5210-1433837032-8013-1437531496.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=hTwKwO6LIUxzN9_63VP6lQ\" alt=\"Bida-5210-1433837032-8013-1437531496.jpg\" loading=\"lazy\" data-src=\"https://i1-thethao.vnecdn.net/2015/07/22/Bida-5210-1433837032-8013-1437531496.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=hTwKwO6LIUxzN9_63VP6lQ\" data-ll-status=\"loaded\"></picture></div>\r\n<figcaption itemprop=\"description\">\r\n<p class=\"Image\">Tay cơ M&atilde; Minh Cẩm c&oacute; thế mạnh carom một băng nhưng anh vẫn mạnh dạn thử sức ở giải carom ba băng lần n&agrave;y. Ảnh:&nbsp;<em>Đức Đồng.</em></p>\r\n</figcaption>\r\n</figure>\r\n<p class=\"Normal\">Đo&agrave;n chủ nh&agrave; Việt Nam tham dự với 60 tay cơ, trong đ&oacute; c&oacute; những người c&oacute; \"số m&aacute;\" như Dương Anh Vũ, Ng&ocirc; Đ&igrave;nh Nại, L&yacute; Thế Vinh, M&atilde; Xu&acirc;n Cường, Trương Quang H&agrave;o&hellip; Giải cũng c&oacute; sự tham dự của tay cơ M&atilde; Minh Cẩm, người đoạt HC bạc SEA Games vừa qua ở nội dung carom một băng.</p>\r\n<p class=\"Normal\">Giải thi đấu theo thể thức loại trực tiếp một lần thua 40 điểm đồng lượt cơ. Tổng gi&aacute; trị giải thưởng của giải đấu l&agrave; 150 triệu đồng, trong đ&oacute; giải nhất gồm cờ, c&uacute;p v&ocirc; địch v&agrave; 50 triệu đồng, giải nh&igrave; 25 triệu đồng, giải ba 15 triệu đồng v&agrave; giải cơ thủ xuất sắc ghi được nhiều điểm nhất trong một lượt cơ 10 triệu đồng.&nbsp;</p>\r\n<p class=\"Normal\">Giải được tổ chức dịp n&agrave;y (từ 24/7 đến 26/7) l&agrave; cơ hội cọ s&aacute;t, t&iacute;ch luỹ kinh nghiệm cho c&aacute;c tay cơ trước khi tham dự World Cup Billiards Carom 3 sẽ được tổ chức tại TPHCM v&agrave;o đầu th&aacute;ng 8/2015.</p>\r\n</article>','2025-03-14 07:55:30.716013','64 cơ thủ tranh tài giải Billiards carom ba băng quốc tế','2025-03-14 07:55:30.716013',1,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/81158678-2e80-441d-bcfb-5b43bc78a7c6_1.png?alt=media',_binary ''),(2,'<article class=\"fck_detail \">\r\n<p class=\"description\">Đương kim v&ocirc; địch Trần Quyết Chiến v&agrave; Bao Phương Vinh sẽ dự giải carom 3 băng đồng đội thế giới 2025, tại Viersen từ 13/3 đến 16/3.</p>\r\n<article class=\"fck_detail \">\r\n<p class=\"Normal\">Việt Nam ở bảng C c&ugrave;ng Bỉ, Thụy Điển v&agrave; Jordan, chơi trận ra qu&acirc;n gặp Jordan l&uacute;c 20h ng&agrave;y 13/3. Đại diện cho đương kim v&ocirc; địch vẫn l&agrave; Quyết Chiến v&agrave; Phương Vinh, hai cơ thủ gi&uacute;p Việt Nam&nbsp;<a href=\"https://vnexpress.net/viet-nam-lan-dau-vo-dich-billiard-dong-doi-the-gioi-4726100.html\" rel=\"dofollow\" data-itm-source=\"#vn_source=Detail-TheThao_CacMonKhac-4857715&amp;vn_campaign=Box-InternalLink&amp;vn_medium=Link-LanDauDangQuang&amp;vn_term=Desktop&amp;vn_thumb=0\" data-itm-added=\"1\">lần đầu đăng quang</a>&nbsp;năm ngo&aacute;i sau khi thắng T&acirc;y Ban Nha s&aacute;t n&uacute;t 15-14 ở loạt tie-break chung kết.</p>\r\n<figure class=\"tplCaption action_thumb_added\" itemprop=\"associatedMedia image\" itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" data-size=\"true\">\r\n<div class=\"fig-picture el_valid\" style=\"margin: 0px; padding: 0px 0px 407.875px; box-sizing: border-box; text-rendering: optimizelegibility; width: 680px; float: left; display: table; -webkit-box-pack: center; justify-content: center; background: #f0eeea; text-align: center; position: relative;\" data-src=\"https://i1-thethao.vnecdn.net/2025/03/06/quye-t-chie-n-phu-o-ng-vinh-17-1854-3105-1741253928.jpg?w=0&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=gNugJKxKtDmWsRBhUEJsQw\" data-sub-html=\"&lt;div class=&quot;ss-wrapper&quot;&gt;&lt;div class=&quot;ss-content&quot;&gt;\r\n&lt;p class=&quot;Image&quot;&gt;Trần Quyết Chiến (tr&aacute;i) v&agrave; Bao Phương Vinh tr&ecirc;n bục trao cup v&agrave; huy chương ở giải carom 3 băng đồng đội thế giới ở Viersen, Đức ng&agrave;y 24/3/2024. Ảnh: &lt;em&gt;Billard1&lt;/em&gt;&lt;/p&gt;\r\n&lt;/div&gt;&lt;/div&gt;\"><picture data-inimage=\"done\"><source srcset=\"https://i1-thethao.vnecdn.net/2025/03/06/quye-t-chie-n-phu-o-ng-vinh-17-1854-3105-1741253928.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Q6aTDnH4Xsx1FijWrcY2Gw 1x, https://i1-thethao.vnecdn.net/2025/03/06/quye-t-chie-n-phu-o-ng-vinh-17-1854-3105-1741253928.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=23dexj8Pza2nvGOzcYS9gw 1.5x, https://i1-thethao.vnecdn.net/2025/03/06/quye-t-chie-n-phu-o-ng-vinh-17-1854-3105-1741253928.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=nGbAMQvU-2zUEGAgWs4oaA 2x\" data-srcset=\"https://i1-thethao.vnecdn.net/2025/03/06/quye-t-chie-n-phu-o-ng-vinh-17-1854-3105-1741253928.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Q6aTDnH4Xsx1FijWrcY2Gw 1x, https://i1-thethao.vnecdn.net/2025/03/06/quye-t-chie-n-phu-o-ng-vinh-17-1854-3105-1741253928.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=23dexj8Pza2nvGOzcYS9gw 1.5x, https://i1-thethao.vnecdn.net/2025/03/06/quye-t-chie-n-phu-o-ng-vinh-17-1854-3105-1741253928.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=nGbAMQvU-2zUEGAgWs4oaA 2x\"><img class=\"lazy lazied\" itemprop=\"contentUrl\" src=\"https://i1-thethao.vnecdn.net/2025/03/06/quye-t-chie-n-phu-o-ng-vinh-17-1854-3105-1741253928.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Q6aTDnH4Xsx1FijWrcY2Gw\" alt=\"Trần Quyết Chiến (tr&aacute;i) v&agrave; Bao Phương Vinh tr&ecirc;n bục trao cup v&agrave; huy chương ở giải carom 3 băng đồng đội thế giới ở Viersen, Đức ng&agrave;y 24/3/2024. Ảnh: Billard1\" loading=\"lazy\" data-src=\"https://i1-thethao.vnecdn.net/2025/03/06/quye-t-chie-n-phu-o-ng-vinh-17-1854-3105-1741253928.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Q6aTDnH4Xsx1FijWrcY2Gw\" data-ll-status=\"loaded\" data-adbro-processed=\"true\"></picture>\r\n<div class=\"embed-container-ads\">\r\n<div id=\"sis_inimage\" data-google-query-id=\"CJ3AjeSuiIwDFZVgDwIdeaUtTQ\">\r\n<div id=\"google_ads_iframe_/27973503/Vnexpress/Desktop/Inimage/Thethao/Thethao.cacmonkhac.detail_0__container__\"><iframe id=\"google_ads_iframe_/27973503/Vnexpress/Desktop/Inimage/Thethao/Thethao.cacmonkhac.detail_0\" tabindex=\"0\" title=\"3rd party ad content\" name=\"google_ads_iframe_/27973503/Vnexpress/Desktop/Inimage/Thethao/Thethao.cacmonkhac.detail_0\" width=\"1\" height=\"1\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" sandbox=\"\" allow=\"private-state-token-redemption;attribution-reporting\" aria-label=\"Advertisement\" data-google-container-id=\"3\" data-load-complete=\"true\"></iframe></div>\r\n</div>\r\n</div>\r\n</div>\r\n<figcaption itemprop=\"description\">\r\n<p class=\"Image\">Trần Quyết Chiến (tr&aacute;i) v&agrave; Bao Phương Vinh tr&ecirc;n bục trao cup v&agrave; huy chương ở giải carom 3 băng đồng đội thế giới ở Viersen, Đức ng&agrave;y 24/3/2024. Ảnh:&nbsp;<em>Billard1</em></p>\r\n</figcaption>\r\n</figure>\r\n<p class=\"Normal\">Đối thủ lớn của Việt Nam tại bảng C lần n&agrave;y, Bỉ kh&ocirc;ng c&oacute; lực lượng mạnh nhất. Họ thiếu hai huyền thoại, Frederic Caudron v&agrave; Eddy Merckx, n&ecirc;n chỉ cử Peter Ceulemans v&agrave; Roland Forthomme - đều ở ngo&agrave;i Top 14 thế giới.</p>\r\n<p class=\"Normal\">Thụy Điển như thường lệ vẫn sử dụng hai cơ thủ gi&agrave;u kinh nghiệm, Torbjorn Blomdahl 62 tuổi v&agrave; Michael Nilsson 54 tuổi. Họ đ&atilde; c&ugrave;ng nhau v&ocirc; địch đồng đội thế giới 7 lần, năm 2000, 2001, 2005, 2006, 2007, 2008 v&agrave; 2009. Blomdahl đang đứng thứ 16 thế giới, c&ograve;n Nilsson đ&atilde; l&acirc;u kh&ocirc;ng thi đấu tại c&aacute;c giải c&aacute; nh&acirc;n thế giới.</p>\r\n<p class=\"Normal\">Đội bị coi yếu nhất bảng l&agrave; Jordan, c&oacute; hai cơ thủ l&agrave; Mashhour Abu Tayeh (đứng thứ 74 thế giới) v&agrave; Ahmed Al Ghababsheh (176). Việt Nam dĩ nhi&ecirc;n l&agrave; ứng vi&ecirc;n vượt qua v&ograve;ng bảng, khi Quyết Chiến đang đứng thứ 4, c&ograve;n Phương Vinh xếp vị tr&iacute; 14.</p>\r\n<p class=\"Normal\">Bảng A gồm Thổ Nhĩ Kỳ, Đức, Colombia v&agrave; Bồ Đ&agrave;o Nha. Bảng B c&oacute; H&agrave;n Quốc, Nhật Bản, Ph&aacute;p v&agrave; Mexico. C&ograve;n bảng D chứa H&agrave; Lan, T&acirc;y Ban Nha, Ai Cập v&agrave; Mỹ. Ngo&agrave;i Việt Nam ở giải n&agrave;y, chỉ H&agrave;n Quốc c&oacute; hai cơ thủ đều thuộc Top 14 thế giới, l&agrave; Cho Myung-woo (2) v&agrave; Heo Jung-han (11).</p>\r\n</article>\r\n</article>','2025-03-14 07:57:58.686615','Việt Nam chuẩn bị bảo vệ danh hiệu billiard đồng đội thế giới','2025-03-14 07:59:31.237644',1,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/2d57a187-fb3e-420f-b4f0-ca5e2cb93a90_2.png?alt=media',_binary '\0'),(3,'<h2 id=\"article_sapo\" class=\"cate-24h-foot-arti-deta-sum ctTp tuht_show\"><strong>(Tin thể thao, tin bi-a) Hot girl mang 2 d&ograve;ng m&aacute;u Việt Nam v&agrave; H&agrave;n Quốc V&otilde; Lee Song Nghi tranh chức v&ocirc; địch c&ugrave;ng c&aacute;c nữ cơ thủ t&agrave;i năng tại giải Billiards Pool sinh vi&ecirc;n TP.HCM C&uacute;p Ph&uacute;c Thịnh 2025.</strong></h2>\r\n<p>&nbsp;</p>\r\n<div id=\"container-24h-banner-in-image\">\r\n<div><img class=\"news-image initial loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-29/anh-1-1743261722-896-width740height493.jpg\" alt=\"Ng&agrave;y thi đấu 29/3 tại giải Billiards Pool sinh vi&ecirc;n TP.HCM C&uacute;p Ph&uacute;c Thịnh 2025 diễn ra tại Trường Đại học Kinh tế T&agrave;i Ch&iacute;nh (Quận B&igrave;nh Thạnh) nhận được ch&uacute; &yacute; của đ&ocirc;ng đảo kh&aacute;n giả. Bởi lẽ, đ&acirc;y l&agrave; ng&agrave;y thi đấu c&oacute; nội dung pool 9 bi nữ bắt đầu tranh t&agrave;i với sự tham gia của 32 cơ thủ t&agrave;i năng v&agrave; xinh đẹp.\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-29/anh-1-1743261722-896-width740height493.jpg\" data-was-processed=\"true\">\r\n<div id=\"24h-banner-in-image\">\r\n<div id=\"ADS_139_15s\" class=\"txtCent  \">\r\n<div class=\"text_adver_right\">&nbsp;</div>\r\n<span id=\"ADS_139_15s_0\" class=\"m_banner_show\"></span></div>\r\n</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p class=\"img_chu_thich_0407\">Ng&agrave;y thi đấu 29/3 tại giải Billiards Pool sinh vi&ecirc;n TP.HCM C&uacute;p Ph&uacute;c Thịnh 2025 diễn ra tại Trường Đại học Kinh tế T&agrave;i Ch&iacute;nh (Quận B&igrave;nh Thạnh) nhận được ch&uacute; &yacute; của đ&ocirc;ng đảo kh&aacute;n giả. Bởi lẽ, đ&acirc;y l&agrave; ng&agrave;y thi đấu c&oacute; nội dung pool 9 bi nữ bắt đầu tranh t&agrave;i với sự tham gia của 32 cơ thủ t&agrave;i năng v&agrave; xinh đẹp.</p>\r\n<p><img class=\"news-image initial loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-29/nh-2-1743261733-123-width740height490.jpg\" alt=\"G&acirc;y ch&uacute; &yacute; bậc nhất l&agrave; c&ocirc; g&aacute;i c&oacute; c&aacute;i t&ecirc;n kh&aacute; đặc biệt V&otilde; Lee Song Nghi. Nữ cơ thủ sinh năm 2004 đến từ trường Đại học Kinh Tế TP.HCM mang 2 d&ograve;ng m&aacute;u khi c&oacute; mẹ l&agrave; người Việt Nam, bố l&agrave; người H&agrave;n Quốc.\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-29/nh-2-1743261733-123-width740height490.jpg\" data-was-processed=\"true\"></p>\r\n<p class=\"img_chu_thich_0407\">G&acirc;y ch&uacute; &yacute; bậc nhất l&agrave; c&ocirc; g&aacute;i c&oacute; c&aacute;i t&ecirc;n kh&aacute; đặc biệt V&otilde; Lee Song Nghi. Nữ cơ thủ sinh năm 2004 đến từ trường Đại học Kinh Tế TP.HCM mang 2 d&ograve;ng m&aacute;u khi c&oacute; mẹ l&agrave; người Việt Nam, bố l&agrave; người H&agrave;n Quốc.</p>\r\n<p><img class=\"news-image loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-29/anh-3-1743261741-351-width740height493.jpg\" alt=\"Song Nghi thi đấu ấn tượng khi lần lượt thắng Trần Thị Mỹ T&acirc;m với tỉ số 4-3, trước khi thắng Trịnh Th&ugrave;y Tr&uacute;c Linh c&aacute;ch biệt 4-2 để ghi t&ecirc;n m&igrave;nh v&agrave;o tứ kết.\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-29/anh-3-1743261741-351-width740height493.jpg\" data-was-processed=\"true\"></p>\r\n<p class=\"img_chu_thich_0407\">Song Nghi thi đấu ấn tượng khi lần lượt thắng Trần Thị Mỹ T&acirc;m với tỉ số 4-3, trước khi thắng Trịnh Th&ugrave;y Tr&uacute;c Linh c&aacute;ch biệt 4-2 để ghi t&ecirc;n m&igrave;nh v&agrave;o tứ kết.</p>\r\n<p><img class=\"news-image loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-29/anh-4-1743261753-161-width740height493.jpg\" alt=\"&ldquo;Mặc d&ugrave; đ&atilde; thi đấu nhiều giải phong tr&agrave;o nhưng đ&acirc;y l&agrave; lần đầu ti&ecirc;n t&ocirc;i tham dự giải đấu c&oacute; quy m&ocirc; v&agrave; c&aacute;ch thức tổ chức chuy&ecirc;n nghiệp như vậy. T&ocirc;i cảm thấy kh&aacute; căng thẳng. T&ocirc;i cũng mong trong thời gian sắp tới, Li&ecirc;n đo&agrave;n Billiards &amp;amp; Snooker TP.HCM (HBSF) sẽ tổ chức th&ecirc;m c&aacute;c giải đấu chất lượng cho sinh vi&ecirc;n để t&ocirc;i c&oacute; thể tham gia&rdquo;, Song Nghi chia sẻ.\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-29/anh-4-1743261753-161-width740height493.jpg\" data-was-processed=\"true\"></p>\r\n<p class=\"img_chu_thich_0407\">&ldquo;Mặc d&ugrave; đ&atilde; thi đấu nhiều giải phong tr&agrave;o nhưng đ&acirc;y l&agrave; lần đầu ti&ecirc;n t&ocirc;i tham dự giải đấu c&oacute; quy m&ocirc; v&agrave; c&aacute;ch thức tổ chức chuy&ecirc;n nghiệp như vậy. T&ocirc;i cảm thấy kh&aacute; căng thẳng. T&ocirc;i cũng mong trong thời gian sắp tới, Li&ecirc;n đo&agrave;n Billiards &amp; Snooker TP.HCM (HBSF) sẽ tổ chức th&ecirc;m c&aacute;c giải đấu chất lượng cho sinh vi&ecirc;n để t&ocirc;i c&oacute; thể tham gia&rdquo;, Song Nghi chia sẻ.</p>','2025-04-08 00:11:56.702559','Người đẹp bi-a 2 dòng máu Việt – Hàn tranh vô địch tại giải pool sinh viên TP.HCM','2025-04-08 00:11:56.702559',1,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/cfe16c58-2fc9-4c19-8b3e-5cf09576b762_2.jpg?alt=media',_binary '\0'),(4,'<p><strong>Bi-a Ngoại hạng Pool hạ m&agrave;n với nhiều bất ngờ</strong></p>\r\n<p>Sau 1 tuần tranh t&agrave;i nảy lửa, giải bi-a pool 9 b&oacute;ng Ngoại hạng diễn ra tại&nbsp;Sarajevo, Bosnia &amp; Herzegovina (từ 20-27/3) đ&atilde; kh&eacute;p lại với nhiều diễn biến bất ngờ.</p>\r\n<p>&nbsp;</p>\r\n<div id=\"container-24h-banner-in-image\">\r\n<div>\r\n<div><img class=\"news-image initial loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-28/SAO-21-tuoi-gay-sung-so-ha-vodich5-1743129092-855-width740height447.png\" alt=\"Moritz Neuhausen chơi qu&aacute; ổn định ở giải bi-a Ngoại hạng Pool vừa kh&eacute;p lại\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-28/SAO-21-tuoi-gay-sung-so-ha-vodich5-1743129092-855-width740height447.png\" data-was-processed=\"true\"></div>\r\n<div id=\"24h-banner-in-image\">\r\n<div id=\"ADS_139_15s\" class=\"txtCent  \">\r\n<div class=\"text_adver_right\">&nbsp;</div>\r\n<span id=\"ADS_139_15s_0\" class=\"m_banner_show\"></span></div>\r\n</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p class=\"img_chu_thich_0407\">Moritz Neuhausen chơi qu&aacute; ổn định ở giải bi-a Ngoại hạng Pool vừa kh&eacute;p lại</p>\r\n<p>Kh&ocirc;ng c&oacute; sự g&oacute;p mặt của của hai cơ thủ h&agrave;ng đầu Fedor Gorst (số 1 thế giới), Joshua Filler (số 2), thế nhưng Eklent Kaci (số 3) hạt giống số 1 của giải lại bị loại ngay v&ograve;ng 1. Sau khi kh&eacute;p lại 15 v&aacute;n đấu đầu ti&ecirc;n của v&ograve;ng 1, \"Đại b&agrave;ng\" Albani kh&ocirc;ng nằm trong top 10 cơ thủ h&agrave;ng đầu n&ecirc;n bị loại.</p>\r\n<p>Giải đấu chứng kiến sự xuất sắc của Robbie Capito (Hong Kong, Trung Quốc) v&agrave; Johann Chua (Philippines), cả hai tay cơ n&agrave;y thay nhau dẫn đầu bảng xếp hạng. Hai cơ thủ n&agrave;y cũng g&oacute;p mặt ở v&ograve;ng b&aacute;n kết, tuy nhi&ecirc;n hai người đi tiếp v&agrave;o trận đấu tranh c&uacute;p l&agrave;&nbsp;​Moritz Neuhausen (Đức) v&agrave; Francisco Sanchez Ruiz (T&acirc;y Ban Nha).</p>\r\n<p><img class=\"news-image loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-28/SAO-21-tuoi-gay-sung-so-ha-vodich4-1743129092-228-width740height439.png\" alt=\"Ruiz trải qua trận chung kết đ&aacute;ng qu&ecirc;n\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-28/SAO-21-tuoi-gay-sung-so-ha-vodich4-1743129092-228-width740height439.png\" data-was-processed=\"true\"></p>\r\n<p class=\"img_chu_thich_0407\">Ruiz trải qua trận chung kết đ&aacute;ng qu&ecirc;n</p>\r\n<p>D&ugrave; phải đối đầu nh&agrave; v&ocirc; địch pool 9 b&oacute;ng 2023, Ruiz&nbsp;với&nbsp;phong độ thăng hoa hiện c&oacute;,&nbsp;Neuhausen đ&atilde; khiến cơ thủ c&oacute; biệt danh \"Ngựa chiến\" tới từ T&acirc;y Ban Nha phải \"l&agrave;m kh&aacute;n giả\" suốt trận. Trong m&agrave;n so t&agrave;i diễn ra v&agrave;o rạng s&aacute;ng 28/3 (giờ Việt Nam),&nbsp;Neuhausen thắng Ruiz tới 7-0, kết quả g&acirc;y sững sờ ở trận tranh c&uacute;p.</p>\r\n<p>Với danh hiệu v&ocirc; địch bi-a Ngoại hạng Pool 2025,&nbsp;Moritz Neuhausen nhận c&uacute;p c&ugrave;ng với phần thưởng 20.000&nbsp;<a class=\"TextlinkBaiviet\" title=\"USD\" href=\"https://www.24h.com.vn/ty-gia-ngoai-te-ttcb-c426.html\">USD</a>, &aacute; qu&acirc;n Ruiz nhận 12.500 USD. Hai cơ thủ đồng hạng ba&nbsp;Chua v&agrave;&nbsp;Capito c&ugrave;ng nhận số tiền 8.000 USD. Giải đấu n&agrave;y, cơ thủ số 1 Việt Nam, Dương Quốc Ho&agrave;ng xếp hạng 9, nhận được 4.750 USD.</p>\r\n<p><strong>Moritz, t&agrave;i năng trẻ của bi-a pool</strong></p>\r\n<p>Moritz Neuhausen, sinh 14/11/2003 tại Gummersbach, Đức, l&agrave; một trong những t&agrave;i năng trẻ đ&aacute;ng ch&uacute; &yacute; trong l&agrave;ng bi-a thế giới. Với chiều cao 1m83 v&agrave; sở hữu kĩ năng thi đấu xuất sắc, anh đ&atilde; nhanh ch&oacute;ng tạo dựng t&ecirc;n tuổi tại c&aacute;c giải đấu quốc tế.</p>\r\n<p>Neuhausen bắt đầu sự nghiệp thi đấu chuy&ecirc;n nghiệp từ rất sớm v&agrave; ngay lập tức đạt được những th&agrave;nh t&iacute;ch đ&aacute;ng nể. Năm 2022, anh gi&agrave;nh chức v&ocirc; địch giải v&ocirc; địch ch&acirc;u &Acirc;u U23 9-Ball. Đến năm 2023, anh gi&agrave;nh ng&ocirc;i &aacute; qu&acirc;n tại Connecticut Open v&agrave; gi&uacute;p đội tuyển Đức đạt vị tr&iacute; &aacute; qu&acirc;n tại World Cup of Pool. Năm 2024, anh tiếp tục tỏa s&aacute;ng khi đăng quang tại Medellin Open ở Mexico City, khẳng định vị thế của m&igrave;nh trong giới bi-a quốc tế.</p>\r\n<p><img class=\"news-image loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-28/SAO-21-tuoi-gay-sung-so-ha-vodich1-1--1743129091-802-width740height434.png\" alt=\"Neuhausen v&agrave; danh hiệu lớn tại bi-a Ngoại hạng Pool 2025\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-28/SAO-21-tuoi-gay-sung-so-ha-vodich1-1--1743129091-802-width740height434.png\" data-was-processed=\"true\"></p>\r\n<p class=\"img_chu_thich_0407\">Neuhausen v&agrave; danh hiệu lớn tại bi-a Ngoại hạng Pool 2025</p>\r\n<p>Neuhausen hiện đứng ở vị tr&iacute; 12 tr&ecirc;n bảng xếp hạng thế giới, với 1 danh hiệu tại c&aacute;c sự kiện xếp hạng v&agrave; thu nhập từ giải thưởng khoảng 99.000 USD. Anh đ&atilde; gi&agrave;nh nhiều danh hiệu cao qu&yacute;, như 4 lần v&ocirc; địch European Youth Champion v&agrave; c&aacute;c huy chương v&agrave;ng tại c&aacute;c giải đấu U19 v&agrave; U17 World Champion, gi&uacute;p Đức khẳng định sức mạnh ở đấu trường quốc tế.</p>\r\n<p>Với chức v&ocirc; địch mới nhất, Neuhausen đăng quang tại IFX Payments Premier League Pool 2025, đ&acirc;y l&agrave; bệ ph&oacute;ng để cơ thủ 21 tuổi hướng tới danh hiệu lớn v&agrave; thứ hạng cao hơn.</p>','2025-04-08 00:12:15.500186','SAO 21 tuổi gây sững sờ, hạ \"Ngựa chiến\" Sanchez 7-0 để vô địch bi-a Ngoại hạng','2025-04-08 00:12:15.500186',1,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/288983e5-4645-4406-99f9-d6e5f919dc0a_3.png?alt=media',_binary '\0'),(5,'<h2 id=\"article_sapo\" class=\"cate-24h-foot-arti-deta-sum ctTp tuht_show\"><strong>(Tin thể thao, tin bi-a) D&agrave;n hot girl như Ma Thị Anh, L&ecirc; Duy Nam Anh hay Song Hee so t&agrave;i tại giải v&ocirc; địch Billiards Pool sinh vi&ecirc;n TP.HCM C&uacute;p Ph&uacute;c Thịnh năm 2025.</strong></h2>\r\n<p><strong>Cột mốc đặc biệt của bi-a sinh vi&ecirc;n TP.HCM</strong></p>\r\n<p>Chiều ng&agrave;y 27/3 tại Hội trường Đại học Kinh tế - T&agrave;i ch&iacute;nh TP.HCM (Quận B&igrave;nh Thạnh) đ&atilde; diễn ra lễ khai mạc giải Billiards Pool sinh vi&ecirc;n TP.HCM C&uacute;p Ph&uacute;c Thịnh năm 2025.</p>\r\n<p>&nbsp;</p>\r\n<div id=\"container-24h-banner-in-image\">\r\n<div><img class=\"news-image initial loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/pool-9-1743073034-486-width740height496.jpg\" alt=\"Ma Thị Anh c&ugrave;ng d&agrave;n hot girl bi-a đại chiến tại giải pool sinh vi&ecirc;n TP.HCM - 1\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/pool-9-1743073034-486-width740height496.jpg\" data-was-processed=\"true\">\r\n<div id=\"24h-banner-in-image\">\r\n<div id=\"ADS_139_15s\" class=\"txtCent  \">\r\n<div class=\"text_adver_right\">&nbsp;</div>\r\n<span id=\"ADS_139_15s_0\" class=\"m_banner_show\"></span></div>\r\n</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p><img class=\"news-image initial loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/pool-11-1743073044-131-width740height493.jpg\" alt=\"Giải Billiards Pool sinh vi&ecirc;n TP.HCM C&uacute;p Ph&uacute;c Thịnh năm 2025 thu h&uacute;t sự quan t&acirc;m của đ&ocirc;ng đảo cơ thủ v&agrave; người h&acirc;m mộ\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/pool-11-1743073044-131-width740height493.jpg\" data-was-processed=\"true\"></p>\r\n<p class=\"img_chu_thich_0407\">Giải Billiards Pool sinh vi&ecirc;n TP.HCM C&uacute;p Ph&uacute;c Thịnh năm 2025 thu h&uacute;t sự quan t&acirc;m của đ&ocirc;ng đảo cơ thủ v&agrave; người h&acirc;m mộ</p>\r\n<p>Giải được tổ chức bởi Li&ecirc;n đo&agrave;n Billiards &amp; Snooker TP.HCM (HBSF) phối hợp c&ugrave;ng Trường Đại học Kinh tế - T&agrave;i ch&iacute;nh TP.HCM (UEF) v&agrave; được t&agrave;i trợ ch&iacute;nh bởi Tập đo&agrave;n Billiards Ph&uacute;c Thịnh. Đ&acirc;y l&agrave; lần đầu ti&ecirc;n, một giải đấu billiards pool d&agrave;nh cho sinh vi&ecirc;n được HBSF tổ chức, tạo ra một s&acirc;n chơi thể thao chuy&ecirc;n nghiệp, chỉn chu, l&agrave;nh mạnh cho sinh vi&ecirc;n.</p>\r\n<p>Giải đấu trở th&agrave;nh cột mốc &yacute; nghĩa, đ&aacute;nh dấu sự ph&aacute;t triển phong tr&agrave;o của bộ m&ocirc;n Billiards trong trường học tại TP.HCM, cũng như nỗ lực x&acirc;y dựng hệ thống giải đấu chuy&ecirc;n nghiệp hơn d&agrave;nh cho sinh vi&ecirc;n của HBSF.</p>\r\n<p><strong>Ma Thị Anh c&ugrave;ng d&agrave;n hot girl đại chiến</strong></p>\r\n<p>Giải đấu diễn ra từ ng&agrave;y 27-30/3 với sự g&oacute;p mặt của gần 250 cơ thủ (32 cơ thủ nữ) ở 2 nội dung pool 9 bi nam v&agrave; pool 9 bi nữ. Trong đ&oacute; c&oacute; một số gương mặt đ&aacute;ng ch&uacute; &yacute;&nbsp;như nữ cơ thủ t&agrave;i năng v&agrave; xinh đẹp L&ecirc; Duy Nam Anh, đương kim v&ocirc; địch giải Olympic UEF 2024, hay &aacute; qu&acirc;n giải Billiards A1 TP.HCM 2024 M&atilde; T&uacute; Lợi.</p>\r\n<p><img class=\"news-image loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/pool-4-1743072926-983-width740height493.jpg\" alt=\"Hot girl bi-a Ma Thị Anh l&agrave; ứng vi&ecirc;n v&ocirc; địch của giải\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/pool-4-1743072926-983-width740height493.jpg\" data-was-processed=\"true\"></p>\r\n<p class=\"img_chu_thich_0407\">Hot girl bi-a Ma Thị Anh l&agrave; ứng vi&ecirc;n v&ocirc; địch của giải</p>\r\n<p class=\"img_chu_thich_0407\"><img class=\"news-image loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/pool-6-1743072949-254-width740height493.jpg\" alt=\"Cơ thủ&amp;nbsp;L&ecirc; Duy Nam Anh\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/pool-6-1743072949-254-width740height493.jpg\" data-was-processed=\"true\"></p>\r\n<p class=\"img_chu_thich_0407\">Cơ thủ L&ecirc; Duy Nam Anh</p>','2025-04-08 00:12:52.911298','Ma Thị Anh cùng dàn hot girl bi-a đại chiến tại giải pool sinh viên TP.HCM','2025-04-08 00:12:52.911298',1,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/45a084d1-71fc-4181-ad04-74a5c7da94e3_1.jpg?alt=media',_binary '\0'),(6,'<h2 id=\"article_sapo\" class=\"cate-24h-foot-arti-deta-sum ctTp tuht_show\"><strong>(Tin thể thao, tin bi-a) Dương Quốc Ho&agrave;ng đ&aacute;nh bại được si&ecirc;u sao Shane Van Boening nhưng gặp kh&oacute; trong trận đấu với Johann Chua. D&ugrave; chia tay giải đấu, Quốc Ho&agrave;ng vẫn trở th&agrave;nh cơ thủ Việt Nam c&oacute; th&agrave;nh t&iacute;ch tốt nhất tại bi-a Ngoại hạng Pool.</strong></h2>\r\n<p><em>Video Quốc Ho&agrave;ng hạ Boening nhưng gặp vận đen trận gặp Chua</em></p>\r\n<div align=\"center\">\r\n<div class=\"viewVideoPlay\">\r\n<div id=\"zplayer_1841d1_container\" class=\"v-24h-media-player\">\r\n<div id=\"v-24hContainer_zplayer_1841d1\" class=\" v-24hContainer_zplayer_1841d1_loaded\">\r\n<div id=\"my-video-multiple1_1744045883495\" class=\"video-js vjs-default-skin vjs-16-9 vjs-paused my-video-multiple1_1744045883495-dimensions vjs-controls-enabled vjs-workinghover vjs-v8 vjs-user-active vjs-theateropt vjs-controlbar-always-show vjs-minable vjs-contextmenu-ui pc-mini-player mini-player\" lang=\"vn\" tabindex=\"-1\" role=\"region\" translate=\"no\" aria-label=\"Video Player\"><video id=\"my-video-multiple1_1744045883495_html5_api\" class=\"vjs-tech\" tabindex=\"-1\" role=\"application\" src=\"blob:https://www.24h.com.vn/90f48a23-5974-45dd-8c4d-5a625d60c5e0\" poster=\"https://vcdn.24h.com.vn/upload/1-2025/images/2025-03-27/1743043057-dangquochoang.jpg\" preload=\"none\"></video>\r\n<div class=\"vjs-poster\" aria-disabled=\"false\"><picture class=\"vjs-poster\" tabindex=\"-1\"><img src=\"https://vcdn.24h.com.vn/upload/1-2025/images/2025-03-27/1743043057-dangquochoang.jpg\" alt=\"\" loading=\"lazy\"></picture></div>\r\n<div class=\"vjs-text-track-display\" translate=\"yes\" aria-live=\"off\" aria-atomic=\"true\">\r\n<div>&nbsp;</div>\r\n</div>\r\n<button class=\"vjs-big-play-button\" title=\"Play Video\" type=\"button\" aria-disabled=\"false\"><span class=\"vjs-control-text\" aria-live=\"polite\">Play Video</span></button>\r\n<div class=\"vjs-overlay vjs-overlay-top-right overlaybutton overideoverlaybtn overLayCloseBtn_my-video-multiple1_1744045883495 vjs-overlay-background\">\r\n<div id=\"overLayCloseBtn_my-video-multiple1_1744045883495\"></div>\r\n</div>\r\n</div>\r\n<div id=\"my-video-multiple1_1744045883495-minableMon\"></div>\r\n</div>\r\n<div id=\"bnnSponBot_zplayer_1841d1\"></div>\r\n</div>\r\n<div>\r\n<div id=\"ADS_200_15s\" class=\"txtCent\"></div>\r\n</div>\r\n</div>\r\n</div>\r\n<p><strong>Dương Quốc Ho&agrave;ng ngẩng cao đầu rời giải bi-a Ngoại hạng</strong></p>\r\n<p>Giải bi-a Premier League Pool 2025 diễn ra tại Bosnia &amp; Herzegovina đang đi đến hồi kết. Trong ng&agrave;y 26/3, giải đấu đ&atilde; x&aacute;c định được 6 c&aacute;i t&ecirc;n tiếp tục v&agrave;o v&ograve;ng 3, gồm Johann Chua (Philippines), Aloysius Yapp (Singapore), Robbie Capito (Hong Kong, Trung Quốc), Moritz Neuhausen (Đức), Jayson Shaw (Anh) v&agrave; Francisco Sanchez Ruiz (T&acirc;y Ban Nha).</p>\r\n<p>&nbsp;</p>\r\n<div id=\"container-24h-banner-in-image\">\r\n<div>\r\n<div><img class=\"news-image initial loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/Hoang-hoangsao-1743042960-287-width740height449.png\" alt=\"Quốc Ho&agrave;ng, 38 tuổi, kh&eacute;p lại sự kiện bi-a Ngoại hạng Pool với vị tr&iacute; 9 chung cuộc\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-27/Hoang-hoangsao-1743042960-287-width740height449.png\" data-was-processed=\"true\"></div>\r\n<div id=\"24h-banner-in-image\">\r\n<div id=\"ADS_139_15s\" class=\"txtCent  \">\r\n<div class=\"text_adver_right\">&nbsp;</div>\r\n<span id=\"ADS_139_15s_0\" class=\"m_banner_show\"></span></div>\r\n</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p class=\"img_chu_thich_0407\">Quốc Ho&agrave;ng, 38 tuổi, kh&eacute;p lại sự kiện bi-a Ngoại hạng Pool với vị tr&iacute; 9 chung cuộc</p>\r\n<p>Bốn cơ thủ nằm trong nh&oacute;m bị loại sau v&ograve;ng 2 gồm Kledio Kaci (Albania), Sanjin Pehlivanovic (Bosnia), Dương Quốc Ho&agrave;ng v&agrave; đương kim v&ocirc; địch Shane Van Boening (Mỹ). D&ugrave; thua trận, nhưng Ho&agrave;ng \"Sao\" đ&atilde; c&oacute; 2 chiến thắng trong ng&agrave;y thi đấu cuối c&ugrave;ng (26/3), trong đ&oacute; phải kể đến chiến thắng oanh liệt 5-3 trước nh&agrave; v&ocirc; địch pool 8 bi v&agrave; 9 bi, Van Boening.</p>\r\n<p>Dương Quốc Ho&agrave;ng đ&atilde; mở đầu ng&agrave;y thi đấu 26/3 rất thuận lợi sau sai lầm của Sanjin để vươn l&ecirc;n dẫn trước 1-0. Sau đ&oacute;, Ho&agrave;ng \"Sao\" tiếp tục thể hiện rất xuất sắc ở những t&igrave;nh huống v&agrave;o b&agrave;n, qua đ&oacute; gi&agrave;nh chiến thắng chung cuộc 5-2 sau 35 ph&uacute;t thi đấu.</p>\r\n<p>Tiếp đ&oacute;, ở m&agrave;n so t&agrave;i với Jayson Shaw, cơ thủ người Anh vừa chơi hay lại gặp may mắn, n&ecirc;n Ho&agrave;ng \"Sao\" đ&agrave;nh chịu thất bại với tỷ số 1-5. Bước v&agrave;o m&agrave;n so t&agrave;i với Van Boening, Quốc Ho&agrave;ng chơi như l&ecirc;n đồng, li&ecirc;n tục dẫn trước, rồi kh&eacute;p lại v&aacute;n đấu với một loạt những pha đi cơ ch&iacute;nh x&aacute;c, điệu nghệ để thắng đối thủ 5-3.</p>\r\n<p>Bước v&agrave;o trận đấu cuối ng&agrave;y với Johann Chua, ở v&aacute;n hill-hill (4-4), Ho&agrave;ng \"Sao\" c&oacute; cơ hội thuận lợi thắng khi chỉ c&ograve;n hai bi tr&ecirc;n b&agrave;n. Tuy nhi&ecirc;n, sau c&uacute; đưa bi 8 v&agrave;o lỗ, bi c&aacute;i của Ho&agrave;ng \"Sao\" cũng chui tọt v&agrave;o lỗ. Điều n&agrave;y tạo cơ hội thuận lợi cho cơ thủ Philippines, Johann Chua, kh&eacute;p lại v&aacute;n đấu.</p>\r\n<p>Chia tay bi-a Ngoại hạng Pool ở v&ograve;ng 2, đứng hạng 9 chung cuộc (11 thắng, 13 thua) v&agrave; nhận phần thưởng 4.750&nbsp;<a class=\"TextlinkBaiviet\" title=\"USD\" href=\"https://www.24h.com.vn/ty-gia-ngoai-te-ttcb-c426.html\">USD</a> (khoảng 120 triệu đồng), Ho&agrave;ng \"Sao\" đi v&agrave;o lịch sử bi-a nước nh&agrave;, trở th&agrave;nh cơ thủ Việt Nam c&oacute; th&agrave;nh t&iacute;ch xuất sắc nhất ở bi-a Ngoại hạng Pool. Trước đ&oacute;, c&aacute;c cơ thủ Lường Đức Thiện v&agrave; Nguyễn Anh Tuấn từng đạt hạng 11 ở c&aacute;c năm 2023 v&agrave; 2024.</p>','2025-04-08 00:13:12.994044','Hoàng \"Sao\" hạ nhà vô địch Van Boening, ngẩng cao đầu rời giải bi-a Ngoại hạng','2025-04-08 00:13:12.994044',1,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/d2e2ba74-cd69-4cd2-922d-c731ec0316c8_5.png?alt=media',_binary '\0'),(7,'<h2 id=\"article_sapo\" class=\"cate-24h-foot-arti-deta-sum ctTp tuht_show\"><strong>(Tin thể thao, tin bi-a) Trận đấu đầy t&iacute;nh biểu diễn giữa \"Thần đồng\" bi-a Philippines v&agrave; \"Đại b&agrave;ng\" Kaci kết th&uacute;c với pha c&acirc;n bốn băng của cơ thủ người Albania.</strong></h2>\r\n<p><em>Video t&igrave;nh huống c&acirc;n 4 băng của 2 cơ thủ</em></p>\r\n<div align=\"center\">\r\n<div class=\"viewVideoPlay\">\r\n<div id=\"zplayer_bdc2e1_container\" class=\"v-24h-media-player\">\r\n<div id=\"v-24hContainer_zplayer_bdc2e1\" class=\" v-24hContainer_zplayer_bdc2e1_loaded\">\r\n<div id=\"my-video-multiple1_1744045887154\" class=\"video-js vjs-default-skin vjs-16-9 vjs-paused my-video-multiple1_1744045887154-dimensions vjs-controls-enabled vjs-workinghover vjs-v8 vjs-user-active vjs-theateropt vjs-controlbar-always-show vjs-minable vjs-contextmenu-ui pc-mini-player mini-player\" lang=\"vn\" tabindex=\"-1\" role=\"region\" translate=\"no\" aria-label=\"Video Player\"><video id=\"my-video-multiple1_1744045887154_html5_api\" class=\"vjs-tech\" tabindex=\"-1\" role=\"application\" src=\"blob:https://www.24h.com.vn/e09b0a5f-102e-4719-91ff-e8816957a29a\" poster=\"https://vcdn.24h.com.vn/upload/1-2025/images/2025-03-26/1742985275-snooker.jpg\" preload=\"none\"></video>\r\n<div class=\"vjs-poster\" aria-disabled=\"false\"><picture class=\"vjs-poster\" tabindex=\"-1\"><img src=\"https://vcdn.24h.com.vn/upload/1-2025/images/2025-03-26/1742985275-snooker.jpg\" alt=\"\" loading=\"lazy\"></picture></div>\r\n<div class=\"vjs-text-track-display\" translate=\"yes\" aria-live=\"off\" aria-atomic=\"true\">\r\n<div>&nbsp;</div>\r\n</div>\r\n<button class=\"vjs-big-play-button\" title=\"Play Video\" type=\"button\" aria-disabled=\"false\"><span class=\"vjs-control-text\" aria-live=\"polite\">Play Video</span></button>\r\n<div class=\"vjs-overlay vjs-overlay-top-right overlaybutton overideoverlaybtn overLayCloseBtn_my-video-multiple1_1744045887154 vjs-overlay-background\">\r\n<div id=\"overLayCloseBtn_my-video-multiple1_1744045887154\"></div>\r\n</div>\r\n</div>\r\n<div id=\"my-video-multiple1_1744045887154-minableMon\"></div>\r\n</div>\r\n<div id=\"bnnSponBot_zplayer_bdc2e1\"></div>\r\n</div>\r\n<div>\r\n<div id=\"ADS_200_15s\" class=\"txtCent\"></div>\r\n</div>\r\n</div>\r\n</div>\r\n<p>Giải Ngoại hạng Pool 2025 tổ chức ở Bosnia and Herzegovina từ 21-28/3, tuy nhi&ecirc;n, sau ng&agrave;y 24/3, chỉ c&ograve;n 10 trong tổng số 16 cơ thủ tiếp tục hiện diện.</p>\r\n<p>&nbsp;</p>\r\n<div id=\"container-24h-banner-in-image\">\r\n<div><img class=\"news-image initial loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-26/kacimanas1-1742985613-320-width740height481.png\" alt=\"Manas (b&ecirc;n phải) c&oacute; m&agrave;n giao lưu tuyệt hay với Kaci (b&ecirc;n tr&aacute;i)\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-26/kacimanas1-1742985613-320-width740height481.png\" data-was-processed=\"true\">\r\n<div id=\"24h-banner-in-image\">\r\n<div id=\"ADS_139_15s\" class=\"txtCent  \">\r\n<div class=\"text_adver_right\">&nbsp;</div>\r\n<span id=\"ADS_139_15s_0\" class=\"m_banner_show\"></span></div>\r\n</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p class=\"img_chu_thich_0407\">Manas (b&ecirc;n phải) c&oacute; m&agrave;n giao lưu tuyệt hay với Kaci (b&ecirc;n tr&aacute;i)</p>\r\n<p>Eklent Kaci (Albania), hạt giống số 1 v&agrave; xếp hạng 3 thế giới pool 9 bi, kết th&uacute;c 15 v&aacute;n đấu với 4 chiến thắng v&agrave; 11 thất bại, kh&ocirc;ng gi&agrave;nh v&eacute; v&agrave;o v&ograve;ng 2. Tương tự, cơ thủ 17 tuổi, được mệnh danh \"Thần đồng\" bi-a Philippines, AJ Manas (hạng 76 thế giới), cũng chỉ c&oacute; 4 điểm sau 15 trận v&agrave; dừng bước.</p>\r\n<p>Ng&agrave;y 25/3, ngo&agrave;i những m&agrave;n so t&agrave;i giữa 10 ng&ocirc;i sao c&ograve;n lại, ban tổ chức mời \"Đại b&agrave;ng\" Kaci v&agrave; tay cơ trẻ Đ&ocirc;ng Nam &Aacute;, Manas thi đấu biểu diễn. Đ&uacute;ng với t&iacute;nh chất của m&agrave;n giao lưu, hai cơ thủ vừa đ&aacute;nh vừa tạo điều kiện cho đối thủ của m&igrave;nh c&oacute; thể ph&ocirc; diễn hết t&agrave;i nghệ.</p>\r\n<p>Ở v&aacute;n thứ 10, sau khi dọn dẹp gần hết b&agrave;n v&agrave; chỉ c&ograve;n 1 bi mục ti&ecirc;u tr&ecirc;n b&agrave;n, bi số 9 đ&atilde; nằm cửa lỗ, chỉ cần đ&aacute;nh nhẹ l&agrave; v&aacute;n đấu kh&eacute;p lại. Tuy nhi&ecirc;n, Manas khiến người xem nhớ tới \"Ph&ugrave; thủy\" đồng hương Efren Reyes khi đ&aacute;nh bi số 9 đi bốn băng trước khi v&agrave;o lỗ, gỡ h&ograve;a 5-5. T&igrave;nh huống khiến kh&aacute;n giả v&ocirc; c&ugrave;ng phấn kh&iacute;ch, \"Đại b&agrave;ng\" Kaci cũng kh&ocirc;ng thể nhịn cười.</p>\r\n<p>Đến v&aacute;n quyết định, khi tỷ số đang l&agrave; 8-8, Manas c&oacute; cơ hội chiến thắng khi hai bi mục ti&ecirc;u (8, 9) ở vị tr&iacute; thuận lợi. Tuy nhi&ecirc;n, cơ thủ Philippines kh&ocirc;ng đ&aacute;nh bi số 8 v&agrave;o lỗ m&agrave; \"chạy đạn\" thử t&agrave;i số 3 thế giới Kaci. Pha giấu bi khiến Kaci buộc phải sử dụng kỹ thuật \"nhảy bi\" ăn bi số 8.</p>\r\n<p>Dường như thử th&aacute;ch n&agrave;y kh&ocirc;ng l&agrave;m kh&oacute; Kaci, anh lập tức \"dạy\" Manas b&agrave;i học. \"Đại b&agrave;ng\" Albania nhảy bi ch&iacute;nh x&aacute;c, đưa bi 8 v&agrave;o lỗ. Cao tr&agrave;o l&ecirc;n đến đỉnh điểm khi Kaci tiếp tục đ&aacute;nh bi số 9 đi 4 băng để gi&agrave;nh thắng lợi chung cuộc 9-8. Đ&acirc;y l&agrave; trận đấu biểu diễn, v&agrave; cả hai cơ thủ đều cười tươi khi trận đấu kh&eacute;p lại.</p>','2025-04-08 00:13:28.023873','\"Thần đồng\" bi-a biểu diễn cân 4 băng, số 3 thế giới liền \"dạy cho bài học\"','2025-04-08 00:13:28.023873',1,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/a719f897-5898-4676-bf90-bf25faa95bdf_6.png?alt=media',_binary '\0'),(8,'<h2 id=\"article_sapo\" class=\"cate-24h-foot-arti-deta-sum ctTp tuht_show\"><strong>(Tin thể thao, tin bi-a) Nguyễn Trần Thanh Tạo đ&atilde; tạo n&ecirc;n c&uacute; sốc lớn khi vượt qua Trần Quyết Chiến ở b&aacute;n kết HBSF Tour 1 C&uacute;p MIN Table năm 2025.</strong></h2>\r\n<p><strong>Nguyễn Trần Thanh Tự v&ocirc; địch kịch t&iacute;nh trước em ruột</strong></p>\r\n<p>Trong trận chung kết nội dung&nbsp;carom 3 băng tại giải Billiards HBSF Tour 1 C&uacute;p MIN Table năm 2025 diễn ra v&agrave;o chiều tối ng&agrave;y 25/3 tại TP.HCM, Nguyễn Trần Thanh Tự l&ecirc;n ng&ocirc;i v&ocirc; địch đầy kịch t&iacute;nh trước người em ruột Nguyễn Trần Thanh Tạo.</p>\r\n<p align=\"center\">&nbsp;</p>\r\n<div id=\"container-24h-banner-in-image\">\r\n<div><img class=\"news-image initial loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-25/Nguyen-Tran-Thanh-Tu-thang-em-ruot-vo-dich-kich-tinh-HBSF-Tour-nguy---n-tr---n-thanh-t------n-m---ng-ch---c-v-----1742902388-45-width740height514.jpg\" alt=\"Thanh Tự v&ocirc; địch giải đấu\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-25/Nguyen-Tran-Thanh-Tu-thang-em-ruot-vo-dich-kich-tinh-HBSF-Tour-nguy---n-tr---n-thanh-t------n-m---ng-ch---c-v-----1742902388-45-width740height514.jpg\" data-was-processed=\"true\">\r\n<div id=\"24h-banner-in-image\">\r\n<div id=\"ADS_139_15s\" class=\"txtCent  \">\r\n<div class=\"text_adver_right\">&nbsp;</div>\r\n<span id=\"ADS_139_15s_0\" class=\"m_banner_show\"></span></div>\r\n</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p class=\"img_chu_thich_0407\">Thanh Tự v&ocirc; địch giải đấu</p>\r\n<p>Với những c&uacute; ra cơ ch&iacute;nh x&aacute;c, trong đ&oacute; c&oacute; một series 8 điểm, Thanh Tạo sớm vươn l&ecirc;n dẫn 23-9. Thanh Tự b&aacute;m đuổi quyết liệt, r&uacute;t ngắn dần c&aacute;ch biệt trước khi san h&ograve;a tỉ số 24-24. D&ugrave; vậy, Thanh Tạo vẫn l&agrave; người c&oacute; lợi thế khi dẫn 26-24 sau hiệp 1.</p>\r\n<p>Sau những m&agrave;n rượt đuổi tỉ số đầy hấp dẫn trong hiệp 2, Thanh Tạo vượt l&ecirc;n dẫn 49-37. Tuy nhi&ecirc;n, d&ugrave; chỉ c&ograve;n c&aacute;ch chức v&ocirc; địch đ&uacute;ng 1 điểm, Thanh Tạo lại li&ecirc;n tiếp c&oacute; những c&uacute; ra cơ thiếu ch&iacute;nh x&aacute;c. Tận dụng cơ hội, Thanh Tự r&uacute;t ngắn dần khoảng c&aacute;ch trước khi tung ra đường cơ 7 điểm để thắng chung cuộc 50-49 sau 37 lượt cơ.</p>\r\n<p><strong>Thanh Tạo loại Quyết Chiến, gặp anh ruột Thanh Tự ở chung kết HBSF Tour</strong></p>\r\n<p>Ở lượt trận&nbsp;b&aacute;n kết nội dung&nbsp;carom 3 băng tại giải Billiards HBSF Tour 1 C&uacute;p MIN Table năm 2025 diễn ra trưa ng&agrave;y 25/3 tại TP.HCM, Nguyễn Trần Thanh Tạo đ&atilde; tạo n&ecirc;n c&uacute; sốc lớn khi vượt qua Trần Quyết Chiến.</p>\r\n<p align=\"center\"><img class=\"news-image loaded\" src=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-25/Thanh-Tao-loai-nguy---n-tr---n-thanh-t---o-lo---i-tr---n-quy---t--1742889418-261-width740height528.jpg\" alt=\"Tay cơ Thanh Tạo g&acirc;y sốc khi loại Quyết Chiến\" data-original=\"https://cdn.24h.com.vn/upload/1-2025/images/2025-03-25/Thanh-Tao-loai-nguy---n-tr---n-thanh-t---o-lo---i-tr---n-quy---t--1742889418-261-width740height528.jpg\" data-was-processed=\"true\"></p>\r\n<p class=\"img_chu_thich_0407\">Tay cơ Thanh Tạo g&acirc;y sốc khi loại Quyết Chiến</p>\r\n<p>Với đường cơ 7 điểm, Quyết Chiến dẫn trước 15-8. Tuy nhi&ecirc;n sau đ&oacute;, Thanh Tạo li&ecirc;n tiếp ghi điểm để dẫn ngược lại 25-24 sau hiệp 1. Diễn biến trong hiệp 2 cực kỳ căng thẳng khi hai cơ thủ thi nhau tung ra series khiến thế trận li&ecirc;n tục đảo chiều. Khi tỉ số đang l&agrave; 48-48, Thanh Tạo bản lĩnh ghi liền 2 điểm để thắng 50-48 sau 35 lượt cơ.</p>\r\n<p>Đối thủ của Thanh Tạo ở chung kết ch&iacute;nh l&agrave; người anh ruột Nguyễn Trần Thanh Tự. Ở trận b&aacute;n kết c&ograve;n lại, Thanh Tự đ&atilde; thắng 50-33 sau 20 lượt cơ trước Bao Phuong Vinh, trong đ&oacute; c&oacute; series 12 điểm v&agrave; 7 điểm.</p>','2025-04-08 00:16:03.642650','Nguyễn Trần Thanh Tự thắng em ruột, vô địch kịch tính HBSF Tour','2025-04-08 00:16:03.642650',1,'https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/102b5361-2b5c-41c3-91e3-021528166486_7.png?alt=media',_binary '\0');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pricing`
--

DROP TABLE IF EXISTS `pricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricing` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `description` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pricing`
--

LOCK TABLES `pricing` WRITE;
/*!40000 ALTER TABLE `pricing` DISABLE KEYS */;
INSERT INTO `pricing` VALUES (1,'2025-04-01 03:11:01.023410','2025-04-10 00:52:05.735073',NULL,'Bảng giá chi nhánh Thủ Đức'),(9,'2025-04-01 04:16:57.615508','2025-04-01 04:16:57.615508',NULL,'Bảng giá chi nhánh Phú Nhuận'),(10,'2025-04-01 04:21:47.963264','2025-04-01 04:21:47.963264',NULL,'Bảng giá chi nhánh Bình Thạnh'),(11,'2025-04-10 00:50:01.423541','2025-04-10 00:50:01.423541',NULL,'Bảng giá chi nhánh Quận 1');
/*!40000 ALTER TABLE `pricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pricing_detail`
--

DROP TABLE IF EXISTS `pricing_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricing_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `time_slot` varchar(255) DEFAULT NULL,
  `pricing_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3thdmk5t0hn3jflhvv4wivbcy` (`pricing_id`),
  CONSTRAINT `FK3thdmk5t0hn3jflhvv4wivbcy` FOREIGN KEY (`pricing_id`) REFERENCES `pricing` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pricing_detail`
--

LOCK TABLES `pricing_detail` WRITE;
/*!40000 ALTER TABLE `pricing_detail` DISABLE KEYS */;
INSERT INTO `pricing_detail` VALUES (1,50000,'00:00 - 12:00',1),(10,50000,'00:00 - 09:00',9),(11,70000,'09:00 - 13:00',9),(12,130000,'17:00 - 24:00',9),(13,90000,'13:00 - 17:00',9),(14,50000,'00:00 - 08:00',10),(15,90000,'08:00 - 12:00',10),(16,110000,'12:00 - 18:00',10),(17,130000,'18:00 - 24:00',10),(18,70000,'00:00 - 10:00',11),(19,90000,'10:00 - 18:00',11),(20,110000,'18:00 - 24:00',11),(21,110000,'12:00 - 18:00',1),(22,130000,'18:00 - 24:00',1);
/*!40000 ALTER TABLE `pricing_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `reservation_time` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `booking_by` bigint DEFAULT NULL,
  `facility_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK960m7fxnlm1gd02w5p2v2t0b2` (`booking_by`),
  KEY `FKk2ho7pcs5a3m9phlq0gjeqx12` (`facility_id`),
  CONSTRAINT `FK960m7fxnlm1gd02w5p2v2t0b2` FOREIGN KEY (`booking_by`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKk2ho7pcs5a3m9phlq0gjeqx12` FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,'2025-04-08 05:13:01.690963','2025-04-09 18:00:00.000000','COMPLETE','2025-04-08 06:16:17.019153',1,4),(2,'2025-04-08 05:32:26.599684','2025-04-09 05:00:00.000000','CANCEL','2025-04-08 05:57:06.478530',2,8),(3,'2025-04-08 05:52:31.368612','2025-04-14 15:30:00.000000','CONFIRMED','2025-04-08 06:14:58.362606',1,8);
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temp_drink_item`
--

DROP TABLE IF EXISTS `temp_drink_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temp_drink_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price_at_that_time` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `drink_id` bigint DEFAULT NULL,
  `session_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5ylyg3q44q4cmh5jtw9s339dm` (`drink_id`),
  KEY `FKiifl1k9ldgchh9bu3kfnch795` (`session_id`),
  CONSTRAINT `FK5ylyg3q44q4cmh5jtw9s339dm` FOREIGN KEY (`drink_id`) REFERENCES `drink_food` (`id`),
  CONSTRAINT `FKiifl1k9ldgchh9bu3kfnch795` FOREIGN KEY (`session_id`) REFERENCES `temp_table_session` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_drink_item`
--

LOCK TABLES `temp_drink_item` WRITE;
/*!40000 ALTER TABLE `temp_drink_item` DISABLE KEYS */;
INSERT INTO `temp_drink_item` VALUES (163,15000,1,3,21),(164,15000,1,6,21),(165,70000,1,7,21),(166,65000,1,1,21),(171,15000,1,3,22),(172,15000,1,6,22),(173,70000,1,7,22),(174,65000,1,1,22),(181,70000,1,7,23),(182,15000,1,6,23),(183,15000,1,3,23),(187,70000,1,7,24),(188,15000,1,2,24),(189,65000,1,1,24),(192,15000,1,2,25),(193,65000,3,1,25);
/*!40000 ALTER TABLE `temp_drink_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temp_table_session`
--

DROP TABLE IF EXISTS `temp_table_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temp_table_session` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `end_time` datetime(6) DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  `table_id` bigint DEFAULT NULL,
  `print_count` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm33wo0ves1sntuatxtrlg5ba9` (`customer_id`),
  KEY `FKmjb5yilgitcjtcceaeafot088` (`table_id`),
  CONSTRAINT `FKm33wo0ves1sntuatxtrlg5ba9` FOREIGN KEY (`customer_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKmjb5yilgitcjtcceaeafot088` FOREIGN KEY (`table_id`) REFERENCES `billiard_table` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_table_session`
--

LOCK TABLES `temp_table_session` WRITE;
/*!40000 ALTER TABLE `temp_table_session` DISABLE KEYS */;
INSERT INTO `temp_table_session` VALUES (21,'2025-04-22 23:59:21.649000','2025-04-22 22:43:33.203000','DONE',2,8,1),(22,'2025-04-22 23:59:21.649000','2025-04-22 22:43:33.203000','DONE',2,8,0),(23,'2025-04-22 23:19:51.932000','2025-04-22 22:45:37.321000','DONE',2,8,0),(24,'2025-04-22 23:13:58.512000','2025-04-22 23:06:52.614000','DONE',NULL,1,0),(25,'2025-04-22 23:37:07.496000','2025-04-22 23:13:59.068000','DONE',NULL,3,0);
/*!40000 ALTER TABLE `temp_table_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `reset_password_token` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','CUSTOMER','STAFF','MANAGER') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'123 Đường 6','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/20f8c3b3-8125-4855-985f-5b72485a6a0b_pikachu.png?alt=media',NULL,'admin123@gmail.com','Trần Nam Khánh',_binary '',_binary '\0','$2a$10$xFFGVpEQCPHZDw5sBNSAI.UoyFpNBzQkQ/p32r8GC9gNqt5vSD6Xm','0967626483',NULL,'ADMIN',NULL,'admin123'),(2,'25/27 Đường 6, Phường Tăng Nhơn Phú B, TP Thủ Đức','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/6271b545-8883-48d6-80d3-48b416a59ea8_T1-1.png?alt=media',NULL,'nguyenvana@gmail.com','Nguyễn Văn A',_binary '',_binary '\0','$2a$10$p5bfdQ2MpSTnxyQBKUtoO.o37dpZwMbOgfI1FVQzf6Oz7l5rM5p.m','0987654321',NULL,'CUSTOMER',NULL,'guyenvana'),(3,'25/27 Đường 6, Phường Tăng Nhơn Phú B, TP Thủ Đức','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/9ffe5603-4dd5-4e00-9ae6-69d46c947195_455832211_899865755508566_560198364815728377_n.jpg?alt=media',NULL,'nguyenvanb@gmail.com','Nguyễn Văn B',_binary '',_binary '\0','$2a$10$TQ2sYot5sDk36335uNO2ausBZGQSGwv28RLWg6jwcgelI5eG625uu','0967626482',NULL,'MANAGER',NULL,'nguyenvanb'),(4,'123 Hoàn Kiếm','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/2935503f-9a20-4368-ba17-b54437521771_T1-1.png?alt=media',NULL,'nguyenvanc@gmail.com','Nguyễn Văn C',_binary '',_binary '\0','$2a$10$cVNSNRe8n8TJ7NcPkXDyYeVSYV9I/oHBEAlaRQfR7sRM2HtN4yEvW','097123561',NULL,'STAFF',NULL,'staff123'),(5,'25/27 Đường 6, Phường Tăng Nhơn Phú B, TP Thủ Đức','https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/c47f062d-b7e1-4acc-99a1-074d39c23c09_bear.png?alt=media',NULL,'khachhang123@gmail.com','Khách Hàng',_binary '',_binary '\0','$2a$10$RJiiUEeYLn1sLJm.J/teAeyhGswZoUkIFqr3K2MLiNsRis95GAUMq','0967626481',NULL,'CUSTOMER',NULL,'khachhang123');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22 23:15:07
