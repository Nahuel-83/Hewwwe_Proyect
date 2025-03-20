-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.1.36-community-log


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema sql_dml_empleados
--

CREATE DATABASE IF NOT EXISTS Departamentos;
USE Departamentos;


CREATE TABLE `provincia` (
  `id_provincia` smallint(6),
  `provincia` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_provincia`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

INSERT INTO `provincia` (`id_provincia`, `provincia`)
VALUES
	(2,'Albacete'),
	(3,'Alicante/Alacant'),
	(4,'Almería'),
	(1,'Álava/Araba'),
	(33,'Asturias'),
	(5,'Ávila'),
	(6,'Badajoz'),
	(7,'Balears, Illes'),
	(8,'Barcelona'),
	(48,'Bizkaia'),
	(9,'Burgos'),
	(10,'Cáceres'),
	(11,'Cádiz'),
	(39,'Cantabria'),
	(12,'Castellón/Castelló'),
	(51,'Ceuta'),
	(13,'Ciudad Real'),
	(14,'Córdoba'),
	(15,'Coruña, A'),
	(16,'Cuenca'),
	(20,'Gipuzkoa'),
	(17,'Girona'),
	(18,'Granada'),
	(19,'Guadalajara'),
	(21,'Huelva'),
	(22,'Huesca'),
	(23,'Jaén'),
	(24,'León'),
	(27,'Lugo'),
	(25,'Lleida'),
	(28,'Madrid'),
	(29,'Málaga'),
	(52,'Melilla'),
	(30,'Murcia'),
	(31,'Navarra'),
	(32,'Ourense'),
	(34,'Palencia'),
	(35,'Palmas, Las'),
	(36,'Pontevedra'),
	(26,'Rioja, La'),
	(37,'Salamanca'),
	(38,'Santa Cruz de Tenerife'),
	(40,'Segovia'),
	(41,'Sevilla'),
	(42,'Soria'),
	(43,'Tarragona'),
	(44,'Teruel'),
	(45,'Toledo'),
	(46,'Valencia/València'),
	(47,'Valladolid'),
	(49,'Zamora'),
	(50,'Zaragoza');



--
-- Definition of table `departamento`
--

DROP TABLE IF EXISTS `departamento`;
CREATE TABLE `departamento` (
  `codigo` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `nome` char(25) COLLATE latin1_spanish_ci DEFAULT NULL,
  `tipo` enum('H','B','A') NOT NULL,
  `cidade` varchar(35) COLLATE latin1_spanish_ci DEFAULT NULL,
  `id_provincia` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`codigo`),
   CONSTRAINT `fk_departamento_provincia` FOREIGN KEY (`id_provincia`) REFERENCES `provincia` (`id_provincia`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Dumping data for table `departamento`
--

/*!40000 ALTER TABLE `departamento` DISABLE KEYS */;
INSERT INTO `departamento` (`codigo`,`nome`,`tipo`,`cidade`,`id_provincia`) VALUES 
 (1,'Central','H','Lugo',27),
 (2,'Oficina1','H','Monforte',27),
 (3,'Oficina2','B','Ferrol',15),
 (4,'Oficina3','H','Vigo',36),
 (5,'Oficina4','A','Ourense',32),
 (6,'Oficina5','A','Villalba',27),
 (7,'Oficina6','H','Ourense',32),
 (8,'Oficina7','H','Lugo',27),
 (9,'Oficina8','A','Coruña',15),
 (10,'Oficina9','B','Villalba',28);
/*!40000 ALTER TABLE `departamento` ENABLE KEYS */;


--
-- Definition of table `empregado`
--

DROP TABLE IF EXISTS `empregado`;
CREATE TABLE `empregado` (
  `dni` int(11) NOT NULL,
  `apelidos` varchar(45) COLLATE latin1_spanish_ci NOT NULL,
  `nome` varchar(30) COLLATE latin1_spanish_ci NOT NULL,
  `departamento` tinyint(3) unsigned DEFAULT NULL,
  `salario_bruto` decimal(9,2) unsigned DEFAULT NULL,
  `dni_xefe` int(11) DEFAULT NULL,
  PRIMARY KEY (`dni`),
  KEY `fk_empregado_departamento` (`departamento`),
  KEY `fk_empregado_empregado1` (`dni_xefe`),
  CONSTRAINT `fk_empregado_departamento` FOREIGN KEY (`departamento`) REFERENCES `departamento` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_empregado_empregado1` FOREIGN KEY (`dni_xefe`) REFERENCES `empregado` (`dni`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Dumping data for table `empregado`
--

/*!40000 ALTER TABLE `empregado` DISABLE KEYS */;
INSERT INTO `empregado` (`dni`,`apelidos`,`nome`,`departamento`,`salario_bruto`,`dni_xefe`) VALUES 
 (12549563,'Case Rodriguez','Fernanda',4,'35520.00',54528788),
 (12852654,'Martinez Iglesias','Benito',1,'25000.00',33456852),
 (15245258,'Nuñez Bernardez','Antonia',2,'42000.00',33987456),
 (33123456,'Fernandez Lopez','Jose Luis',1,'160000.00',NULL),
 (33147258,'Ruiz Macias','Dario',10,'32000.00',33456852),
 (33219853,'Hernandez Valin','Valentina',3,'26000.00',33963258),
 (33251256,'Martinez Diaz','Carlos',2,'31500.00',33987456),
 (33254916,'Iglesias Dominguez','Adolfo',NULL,'52500.00',33123456),
 (33322541,'Villar Bernal','Teolindo',5,'17500.00',58745124),
 (33257964,'Villar Bernal','Rosario',4,'25000.00',54528788),
 (33365846,'Quiroga Juarez','Francisco',3,'36500.00',33963258),
 (33456852,'Fernandez Diaz','Julian',1,'85400.00',33123456),
 (33558994,'Abelleira Carrion','Dorinda',6,'19500.00',58745124),
 (33625566,'Garcia Perez','Adrian',5,'21500.00',58745124),
 (33845215,'Sanchez Rodirguez','Maria',3,'35400.00',33963258),
 (33891564,'Aguiar Lopez','Luis',9,'35000.00',54528788);
INSERT INTO `empregado` (`dni`,`apelidos`,`nome`,`departamento`,`salario_bruto`,`dni_xefe`) VALUES 
 (33963258,'Bernardez Macia','Luisa',8,'65200.00',33456852),
 (33987456,'Porto Novo','Begoña',9,'52000.00',33456852),
 (54528788,'Canedo Tellez','Angeles',4,'58500.00',33456852),
 (58745124,'Cendan Villa','Lorenzo',7,'65350.00',33456852);
/*!40000 ALTER TABLE `empregado` ENABLE KEYS */;


--
-- Definition of table `irpf`
--

DROP TABLE IF EXISTS `irpf`;
CREATE TABLE `irpf` (
  `limite_inferior` decimal(10,2) unsigned NOT NULL,
  `limite_superior` decimal(10,2) unsigned NOT NULL,
  `tipo_imposto` decimal(4,2) NOT NULL,
  PRIMARY KEY (`tipo_imposto`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Dumping data for table `irpf`
--

/*!40000 ALTER TABLE `irpf` DISABLE KEYS */;
INSERT INTO `irpf` (`limite_inferior`,`limite_superior`,`tipo_imposto`) VALUES 
 ('0.00','17707.00','15.75'),
 ('17707.00','33007.00','21.00'),
 ('33007.00','53407.00','27.00'),
 ('53407.00','120000.00','30.00'),
 ('120000.00','175000.00','35.00'),
 ('175000.00','300000.00','42.00'),
 ('300000.00','99999999.99','55.00');
/*!40000 ALTER TABLE `irpf` ENABLE KEYS */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
