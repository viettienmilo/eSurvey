-- MySQL dump 10.13  Distrib 9.4.0, for Win64 (x86_64)
--
-- Host: localhost    Database: esurvey
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `respondent_id` int NOT NULL,
  `question_id` int NOT NULL,
  `answer` text,
  PRIMARY KEY (`id`),
  KEY `answers_respondents_FK` (`respondent_id`),
  KEY `answers_questions_FK` (`question_id`),
  CONSTRAINT `answers_questions_FK` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `answers_respondents_FK` FOREIGN KEY (`respondent_id`) REFERENCES `respondents` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,1,1,'1'),(2,1,2,'5'),(3,1,3,'2'),(4,1,4,'3'),(5,1,5,'4'),(6,1,6,'2'),(7,1,7,'1'),(8,1,8,'3'),(9,1,9,'2'),(10,1,10,'5'),(11,1,11,'2'),(12,1,12,'3'),(13,1,13,'3'),(14,1,14,'1'),(15,1,15,'1'),(16,2,1,'2'),(17,2,2,'2'),(18,2,3,'1'),(19,2,4,'1'),(20,2,5,'3'),(21,2,6,'2'),(22,2,7,'2'),(23,2,8,'1'),(24,2,9,'2'),(25,2,10,'1'),(26,2,11,'1'),(27,2,12,'1'),(28,2,13,'3'),(29,2,14,'1'),(30,2,15,'2'),(31,3,1,'1'),(32,3,2,'1'),(33,3,3,'1'),(34,3,4,'1'),(35,3,5,'3'),(36,3,6,'2'),(37,3,7,'4'),(38,3,8,'1'),(39,3,9,'2'),(40,3,10,'2'),(41,3,11,'2'),(42,3,12,'2'),(43,3,13,'1'),(44,3,14,'1'),(45,3,15,'3');
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `survey_id` int NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('likert','select','text') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'likert',
  `question_order` int NOT NULL,
  `question_options` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `questions_surveys_FK` (`survey_id`),
  CONSTRAINT `questions_surveys_FK` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,1,'Giới tính của bạn là gì?','select',1,'{\"options\": [\"Nam\", \"Nữ\", \"Khác\"]}'),(2,1,'Độ tuổi của bạn trong khoảng nào?','select',2,'{\"options\": [\"<18\", \"18-24\", \"25-34\", \"35-44\", \"45+\"]}'),(3,1,'Nghề nghiệp hiện tại của bạn là gi?','select',3,'{\"options\": [\"Sinh viên/HS\", \"Nhân viên\", \"Kinh doanh\", \"Khác\"]}'),(4,1,'Thu nhập hàng tháng của bạn trong khoảng nào?','select',4,'{\"options\": [\"<5 triệu\", \"5-10 triệu\", \"10-20 triệu\", \">20 triệu\"]}'),(5,1,'Bạn thường mua sắm hàng hóa/dịch vụ bao lâu một lần?','select',5,'{\"options\": [\"Hàng ngày\", \"Hàng tuần\", \"Hàng tháng\", \"Hiếm khi\"]}'),(6,1,'Bạn thích mua sắm trực tiếp tại cửa hàng hay trực tuyến (online) hơn?','select',6,'{\"options\": [\"Trực tiếp\", \"Online\"]}'),(7,1,'Bạn hay mua sắm trên kênh online nào nhất?','select',7,'{\"options\": [\"Shopee\", \"Tiktok\", \"Tiki\", \"Facebook\", \"Khác\"]}'),(8,1,'Yếu tố nào quan trọng nhất khi bạn quyết định mua hàng?','select',8,'{\"options\": [\"Giá cả\", \"Chất lượng\", \"Thương hiệu\", \"Review\", \"Khuyến mãi\"]}'),(9,1,'Bạn thường mua sắm theo kế hoạch hay tùy hứng?','select',9,'{\"options\": [\"Theo kế hoạch\", \"Tùy hứng\"]}'),(10,1,'Điều gì khiến bạn dễ ra quyết định mua theo tùy hứng?','select',10,'{\"options\": [\"Giảm giá sốc\", \"Flash sale\", \"Được idol giới thiệu\", \"Trải nghiệm trực tiếp\", \"Quà tặng khủng\"]}'),(11,1,'Bạn có thường so sánh giá cả trước khi quyết định mua không?','select',11,'{\"options\": [\"Luôn luôn\", \"Thường xuyên\", \"Thỉnh thoảng\", \"Hiếm khi\", \"Không bao giờ\"]}'),(12,1,'Mức độ ảnh hưởng của mạng xã hội (Facebook, Tiktok, Instagram,...) đến quyết định mua sắm của bạn như thế nào?','select',12,'{\"options\": [\"Rất ảnh hưởng\", \"Khá ảnh hưởng\", \"Ảnh hưởng\", \"Ít ảnh hưởng\", \"Không ảnh hưởng\"]}'),(13,1,'Bạn thường làm gì nếu gặp vấn đề với đơn hàng khi mua sắm trực tuyến?','select',13,'{\"options\": [\"Liên hệ DV CSKH\", \"Đánh giá 1 sao\", \"Trả hàng và hoàn tiền\", \"Im lặng và bỏ shop\"]}'),(14,1,'Bạn có sẵn sàng giới thiệu sản phẩm và shop bạn yêu thích cho bạn bè/ người thân không?','select',14,'{\"options\": [\"Có\", \"Không\"]}'),(15,1,'Điều gì quan trọng nhất khiến bạn trở thành khách hàng trung thành của một thương hiệu?','select',15,'{\"options\": [\"Chất lượng ổn định\", \"Dịch vụ CSKH tốt\", \"Có nhiều chương trình tri ân\"]}');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respondents`
--

DROP TABLE IF EXISTS `respondents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respondents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `survey_id` int NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `respondents_surveys_FK` (`survey_id`),
  CONSTRAINT `respondents_surveys_FK` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respondents`
--

LOCK TABLES `respondents` WRITE;
/*!40000 ALTER TABLE `respondents` DISABLE KEYS */;
INSERT INTO `respondents` VALUES (1,1,'2026-03-01 14:07:56'),(2,1,'2026-03-01 15:48:15'),(3,1,'2026-03-01 15:50:13');
/*!40000 ALTER TABLE `respondents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surveys`
--

DROP TABLE IF EXISTS `surveys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surveys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surveys`
--

LOCK TABLES `surveys` WRITE;
/*!40000 ALTER TABLE `surveys` DISABLE KEYS */;
INSERT INTO `surveys` VALUES (1,'Khảo sát Hành vi mua sắm của Khách hàng','Các yếu tố ảnh hường quyết định tiêu dùng của người tiêu dùng Việt Nam trên các sàn TMĐT','2026-02-27 22:47:26');
/*!40000 ALTER TABLE `surveys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'esurvey'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-02 18:55:54
