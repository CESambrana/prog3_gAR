-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: clinica_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `especialidades` (
  `id_especialidad` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `activo` tinyint(3) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_especialidad`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medicos`
--

DROP TABLE IF EXISTS `medicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medicos` (
  `id_medico` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) unsigned NOT NULL,
  `id_especialidad` int(10) unsigned NOT NULL,
  `matricula` int(10) unsigned NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valor_consulta` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_medico`),
  UNIQUE KEY `matricula` (`matricula`),
  KEY `fk_medicos_especialidades` (`id_especialidad`),
  KEY `fk_medicos_usuarios` (`id_usuario`),
  CONSTRAINT `fk_medicos_especialidades` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`),
  CONSTRAINT `fk_medicos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medicos_obras_sociales`
--

DROP TABLE IF EXISTS `medicos_obras_sociales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medicos_obras_sociales` (
  `id_medico_obra_social` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_medico` int(10) unsigned NOT NULL,
  `id_obra_social` int(10) unsigned NOT NULL,
  `activo` tinyint(3) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_medico_obra_social`),
  KEY `fk_mos_medico` (`id_medico`),
  KEY `fk_mos_obra_social` (`id_obra_social`),
  CONSTRAINT `fk_mos_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_mos_obra_social` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `obras_sociales`
--

DROP TABLE IF EXISTS `obras_sociales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `obras_sociales` (
  `id_obra_social` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) NOT NULL DEFAULT '',
  `porcentaje_descuento` decimal(9,2) NOT NULL DEFAULT 0.00,
  `es_particular` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `activo` tinyint(3) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_obra_social`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pacientes` (
  `id_paciente` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) unsigned NOT NULL,
  `id_obra_social` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_paciente`),
  KEY `fk_pacientes_obras_sociales` (`id_obra_social`),
  KEY `fk_pacientes_usuarios` (`id_usuario`),
  CONSTRAINT `fk_pacientes_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`),
  CONSTRAINT `fk_pacientes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `turnos_reservas`
--

DROP TABLE IF EXISTS `turnos_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `turnos_reservas` (
  `id_turno_reserva` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_medico` int(10) unsigned NOT NULL,
  `id_paciente` int(10) unsigned NOT NULL,
  `id_obra_social` int(10) unsigned NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `atendido` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `activo` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id_turno_reserva`),
  KEY `fk_turnos_medicos` (`id_medico`),
  KEY `fk_turnos_pacientes` (`id_paciente`),
  KEY `fk_turnos_obras_sociales` (`id_obra_social`),
  CONSTRAINT `fk_turnos_medicos` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`),
  CONSTRAINT `fk_turnos_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`),
  CONSTRAINT `fk_turnos_pacientes` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `documento` varchar(20) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `foto_path` varchar(255) NOT NULL DEFAULT '',
  `rol` tinyint(3) unsigned NOT NULL,
  `activo` tinyint(3) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `documento` (`documento`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `v_medicos`
--

DROP TABLE IF EXISTS `v_medicos`;
/*!50001 DROP VIEW IF EXISTS `v_medicos`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_medicos` AS SELECT
 1 AS `id_medico`,
  1 AS `id_usuario`,
  1 AS `apellido`,
  1 AS `nombres`,
  1 AS `email`,
  1 AS `foto_path` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `v_pacientes`
--

DROP TABLE IF EXISTS `v_pacientes`;
/*!50001 DROP VIEW IF EXISTS `v_pacientes`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_pacientes` AS SELECT
 1 AS `id_paciente`,
  1 AS `id_usuario`,
  1 AS `apellido`,
  1 AS `nombres`,
  1 AS `email`,
  1 AS `id_obra_social`,
  1 AS `descripcion_obra_social`,
  1 AS `foto_path` */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_medicos`
--

/*!50001 DROP VIEW IF EXISTS `v_medicos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_medicos` AS select `m`.`id_medico` AS `id_medico`,`m`.`id_usuario` AS `id_usuario`,`u`.`apellido` AS `apellido`,`u`.`nombres` AS `nombres`,`u`.`email` AS `email`,`u`.`foto_path` AS `foto_path` from (`medicos` `m` join `usuarios` `u` on(`m`.`id_usuario` = `u`.`id_usuario`)) where `u`.`activo` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_pacientes`
--

/*!50001 DROP VIEW IF EXISTS `v_pacientes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_pacientes` AS select `p`.`id_paciente` AS `id_paciente`,`p`.`id_usuario` AS `id_usuario`,`u`.`apellido` AS `apellido`,`u`.`nombres` AS `nombres`,`u`.`email` AS `email`,`os`.`id_obra_social` AS `id_obra_social`,`os`.`descripcion` AS `descripcion_obra_social`,`u`.`foto_path` AS `foto_path` from ((`pacientes` `p` join `usuarios` `u` on(`p`.`id_usuario` = `u`.`id_usuario`)) join `obras_sociales` `os` on(`p`.`id_obra_social` = `os`.`id_obra_social`)) where `u`.`activo` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-01 15:19:42
