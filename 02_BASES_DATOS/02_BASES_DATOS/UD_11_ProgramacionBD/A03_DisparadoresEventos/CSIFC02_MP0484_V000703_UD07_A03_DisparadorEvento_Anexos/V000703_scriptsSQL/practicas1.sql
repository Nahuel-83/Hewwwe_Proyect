-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: localhost    Database: practicas1
-- ------------------------------------------------------
-- Server version	5.6.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actor`
--
/*creación da base de datos tarefaU4A1*/
CREATE DATABASE IF NOT EXISTS practicas1
	DEFAULT CHARACTER SET UTF8
	DEFAULT COLLATE UTF8_SPANISH_CI;
/*activación da base de datos practicas1*/
USE practicas1;
DROP TABLE IF EXISTS `actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actor` (
  `idActor` mediumint(8) unsigned NOT NULL,
  `nome` varchar(40) COLLATE utf8_spanish_ci NOT NULL,
  `apelido1` varchar(40) COLLATE utf8_spanish_ci DEFAULT NULL,
  `apelido2` varchar(40) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`idActor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actor`
--

LOCK TABLES `actor` WRITE;
/*!40000 ALTER TABLE `actor` DISABLE KEYS */;
/*!40000 ALTER TABLE `actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actuacion`
--

DROP TABLE IF EXISTS `actuacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actuacion` (
  `codConcerto` mediumint(8) unsigned NOT NULL,
  `codGrupo` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`codConcerto`,`codGrupo`),
  KEY `fk_actuacion_grupo` (`codGrupo`),
  CONSTRAINT `fk_actuacion_concerto` FOREIGN KEY (`codConcerto`) REFERENCES `concerto` (`codConcerto`) ON UPDATE CASCADE,
  CONSTRAINT `fk_actuacion_grupo` FOREIGN KEY (`codGrupo`) REFERENCES `grupo` (`codGrupo`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actuacion`
--

LOCK TABLES `actuacion` WRITE;
/*!40000 ALTER TABLE `actuacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `actuacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciclista`
--

DROP TABLE IF EXISTS `ciclista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ciclista` (
  `fichaFederativa` mediumint(8) unsigned NOT NULL,
  `dataNacemento` date DEFAULT NULL,
  `nome` varchar(40) COLLATE utf8_spanish_ci NOT NULL,
  `apelidos` varchar(80) COLLATE utf8_spanish_ci DEFAULT NULL,
  `codEquipo` char(9) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`fichaFederativa`),
  KEY `fk_ciclista_equipo` (`codEquipo`),
  CONSTRAINT `fk_ciclista_equipo` FOREIGN KEY (`codEquipo`) REFERENCES `equipo` (`codEquipo`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclista`
--

LOCK TABLES `ciclista` WRITE;
/*!40000 ALTER TABLE `ciclista` DISABLE KEYS */;
/*!40000 ALTER TABLE `ciclista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concerto`
--

DROP TABLE IF EXISTS `concerto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concerto` (
  `codConcerto` mediumint(8) unsigned NOT NULL,
  `nome` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `data` date DEFAULT NULL,
  `aforo` smallint(5) unsigned DEFAULT NULL COMMENT 'numero máximo de espectadores',
  `prezo` decimal(5,2) unsigned DEFAULT NULL COMMENT 'prezo da entrada',
  PRIMARY KEY (`codConcerto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concerto`
--

LOCK TABLES `concerto` WRITE;
/*!40000 ALTER TABLE `concerto` DISABLE KEYS */;
/*!40000 ALTER TABLE `concerto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contador`
--

DROP TABLE IF EXISTS `contador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contador` (
  `codContador` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `modelo` enum('aeg235','samsung20','aeg55') COLLATE utf8_spanish_ci NOT NULL,
  `codPiso` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`codContador`),
  KEY `fk_contador_piso` (`codPiso`),
  CONSTRAINT `fk_contador_piso` FOREIGN KEY (`codPiso`) REFERENCES `piso` (`codPiso`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contador`
--

LOCK TABLES `contador` WRITE;
/*!40000 ALTER TABLE `contador` DISABLE KEYS */;
/*!40000 ALTER TABLE `contador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamento`
--

DROP TABLE IF EXISTS `departamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departamento` (
  `codigoDepartamento` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `localizacion` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nssXefe` char(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`codigoDepartamento`),
  KEY `fk_departamento_empregado` (`nssXefe`),
  CONSTRAINT `fk_departamento_empregado` FOREIGN KEY (`nssXefe`) REFERENCES `empregado` (`nss`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamento`
--

LOCK TABLES `departamento` WRITE;
/*!40000 ALTER TABLE `departamento` DISABLE KEYS */;
INSERT INTO `departamento` VALUES (10,'xerencia','Lugo','33221144'),(20,'produción1','Lugo','33221144'),(30,'produción 2','Ourense','3202588520'),(40,'produción3','Coruña','150251236');
/*!40000 ALTER TABLE `departamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empregado`
--

DROP TABLE IF EXISTS `empregado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empregado` (
  `dni` char(9) COLLATE utf8_unicode_ci NOT NULL,
  `nss` char(10) COLLATE utf8_unicode_ci NOT NULL,
  `nome` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `dataNacemento` date DEFAULT NULL,
  `sexo` enum('h','m') COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'h = home, m = muller',
  `salario` decimal(11,2) unsigned DEFAULT NULL,
  `codigoDepartamento` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`nss`),
  KEY `idx_empregado_nss` (`nss`),
  KEY `fk_empregado_departamento` (`codigoDepartamento`),
  CONSTRAINT `fk_empregado_departamento` FOREIGN KEY (`codigoDepartamento`) REFERENCES `departamento` (`codigoDepartamento`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empregado`
--

LOCK TABLES `empregado` WRITE;
/*!40000 ALTER TABLE `empregado` DISABLE KEYS */;
INSERT INTO `empregado` VALUES ('44552010K','150251236','Bernardez Varela, Luis','1963-11-25','h',1200.00,30),('22852470S','162255211','Fernádez Pjón, Manuela','1980-03-22','m',1200.00,10),('33258458K','2700011501','Barcia Jiménez, Francisco','1959-10-08','h',1800.00,10),('33221144J','2725412501','Fernádez García, Juia','1978-02-15','m',2510.00,10),('25489263L','3202588520','Mendez Carlin, Xelmirez','1962-05-03','h',1700.00,20);
/*!40000 ALTER TABLE `empregado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipo`
--

DROP TABLE IF EXISTS `equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipo` (
  `codEquipo` char(9) COLLATE utf8_spanish_ci NOT NULL,
  `nome` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `director` varchar(80) COLLATE utf8_spanish_ci DEFAULT NULL,
  `urlWeb` varchar(150) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`codEquipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo`
--

LOCK TABLES `equipo` WRITE;
/*!40000 ALTER TABLE `equipo` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fabricante`
--

DROP TABLE IF EXISTS `fabricante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fabricante` (
  `cif` char(10) COLLATE utf8_spanish_ci NOT NULL,
  `nome` varchar(80) COLLATE utf8_spanish_ci NOT NULL,
  `email` varchar(150) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`cif`),
  KEY `idx_fabicante_cif` (`cif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fabricante`
--

LOCK TABLES `fabricante` WRITE;
/*!40000 ALTER TABLE `fabricante` DISABLE KEYS */;
/*!40000 ALTER TABLE `fabricante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupo`
--

DROP TABLE IF EXISTS `grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grupo` (
  `codGrupo` smallint(5) unsigned NOT NULL,
  `nome` varchar(80) COLLATE utf8_spanish_ci NOT NULL,
  `custo` mediumint(8) unsigned DEFAULT NULL,
  `dataFormacion` date DEFAULT NULL,
  PRIMARY KEY (`codGrupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo`
--

LOCK TABLES `grupo` WRITE;
/*!40000 ALTER TABLE `grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pelicula`
--

DROP TABLE IF EXISTS `pelicula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pelicula` (
  `codPelicula` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `xenero` tinyint(3) unsigned zerofill DEFAULT NULL,
  `duracion` decimal(4,2) unsigned DEFAULT NULL,
  PRIMARY KEY (`codPelicula`),
  KEY `fk_pelicula_xenero` (`xenero`),
  CONSTRAINT `fk_pelicula_xenero` FOREIGN KEY (`xenero`) REFERENCES `xenero` (`codXenero`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pelicula`
--

LOCK TABLES `pelicula` WRITE;
/*!40000 ALTER TABLE `pelicula` DISABLE KEYS */;
/*!40000 ALTER TABLE `pelicula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personaxe`
--

DROP TABLE IF EXISTS `personaxe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personaxe` (
  `codPersonaxe` char(10) COLLATE utf8_spanish_ci NOT NULL,
  `descricion` varchar(40) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`codPersonaxe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personaxe`
--

LOCK TABLES `personaxe` WRITE;
/*!40000 ALTER TABLE `personaxe` DISABLE KEYS */;
/*!40000 ALTER TABLE `personaxe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `piso`
--

DROP TABLE IF EXISTS `piso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `piso` (
  `codPiso` smallint(5) unsigned NOT NULL,
  `domicilio` varchar(150) COLLATE utf8_spanish_ci NOT NULL,
  `localidade` varchar(80) COLLATE utf8_spanish_ci DEFAULT NULL,
  `codPostal` char(5) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`codPiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `piso`
--

LOCK TABLES `piso` WRITE;
/*!40000 ALTER TABLE `piso` DISABLE KEYS */;
/*!40000 ALTER TABLE `piso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xenero`
--

DROP TABLE IF EXISTS `xenero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xenero` (
  `codXenero` tinyint(3) unsigned zerofill NOT NULL,
  `descricionBreve` char(15) COLLATE utf8_unicode_ci NOT NULL,
  `descricionLarga` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`codXenero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xenero`
--

LOCK TABLES `xenero` WRITE;
/*!40000 ALTER TABLE `xenero` DISABLE KEYS */;
/*!40000 ALTER TABLE `xenero` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-25 20:30:39
