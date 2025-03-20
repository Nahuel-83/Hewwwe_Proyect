/*-----------------------------------
-------------------------------------
Solucións do boletín de exercicios 1
-------------------------------------
-------------------------------------*/

/*-----------Exercicio 1-----------*/
-- Creación da base de datos practicas2
create database if not exists practicas2
    character set latin1
    collate latin1_spanish_ci;
-- ou tamén se pode facer 
create schema if not exists practicas2
    default character set latin1
    collate latin1_spanish_ci ;

/*-----------Exercicio 2-----------*/
use practicas2;

/*-----------Exercicio 3-----------*/
drop database if exists practicas2;

/*-----------Exercicio 4A-----------*/
-- creación da base de datos practicas1
create database if not exists practicas1
	default character set utf8
	default collate utf8_spanish_ci;

-- Poderíase crear a táboa sen necesidade de activar a
-- base de datos, utilizando a notación nomeBd.nomeTaboa

drop table if exists practicas1.fabricante;
CREATE TABLE practicas1.fabricante (
    idFabricante CHAR(5) NOT NULL,
    nome VARCHAR(80) NOT NULL,
    PRIMARY KEY (idFabricante)
)  ENGINE=MYISAM;

-- Outra forma de facelo:
-- creación da base de datos practicas1 utilizando a opción schema

create schema if not exists practicas1
	default character set utf8
	default collate utf8_spanish_ci;
    
-- Activar a base de datos practicas1
use practicas1;

-- Borrar a táboa no caso de que exista coa sentenza DROP e creala coa sentenza CREATE
-- As operacións fanse sobre a base de datos activa, que é practicas1

drop table if exists fabricante;
CREATE TABLE fabricante (
    idFabricante CHAR(5) NOT NULL,
    nome VARCHAR(80) NOT NULL,
    PRIMARY KEY (idFabricante)
)  ENGINE=MYISAM;


/*-----------Exercicio 4B-----------*/

-- Activación da base de datos practicas1
use practicas1;

-- Creación da táboa pelicula, se non existe
CREATE TABLE IF NOT EXISTS pelicula (
    codPelicula SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL,
    anoRodaxe DATE NULL,
    titulo VARCHAR(100)CHARACTER SET LATIN1 COLLATE LATIN1_GENERAL_CI NOT NULL,
    xenero VARCHAR(30) NOT NULL,
    duracion DECIMAL(4 , 2 ) UNSIGNED NOT NULL,
    PRIMARY KEY (codPelicula)
)  ENGINE=INNODB DEFAULT CHARACTER SET LATIN1 DEFAULT COLLATE LATIN1_SPANISH_CI;

-- Creación da táboa nacionalidade, se non existe
CREATE TABLE IF NOT EXISTS nacionalidade (
    codPelicula SMALLINT UNSIGNED NOT NULL,
    nacionalidade VARCHAR(30) NOT NULL,
    PRIMARY KEY (codPelicula , nacionalidade),
    CONSTRAINT fk_nacionalidade_pelicula FOREIGN KEY (codPelicula)
        REFERENCES pelicula (codPelicula)
        ON DELETE RESTRICT ON UPDATE CASCADE
)  ENGINE=INNODB DEFAULT CHARACTER SET LATIN1 DEFAULT COLLATE LATIN1_SPANISH_CI;

/*-----------Exercicio 4C-----------*/

-- Activación da base de datos practicas1
use practicas1;

-- Creación da táboa equipo, se non existe
CREATE TABLE IF NOT EXISTS equipo (
    codEquipo CHAR(9) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    director VARCHAR(80) NOT NULL,
    urlWeb VARCHAR(150) NOT NULL,
    PRIMARY KEY (codEquipo)
)  ENGINE=INNODB;

-- Creación da táboa ciclista, se non existe
CREATE TABLE IF NOT EXISTS ciclista (
    fichaFederativa MEDIUMINT UNSIGNED NOT NULL,
    dataNacemento DATE NOT NULL,
    nome VARCHAR(40) NOT NULL,
    apelidos VARCHAR(80) NOT NULL,
    codEquipo CHAR(9) NOT NULL,
    PRIMARY KEY (fichaFederativa),
    CONSTRAINT fk_ciclista_equipo FOREIGN KEY (codEquipo)
        REFERENCES equipo (codEquipo)
        ON DELETE RESTRICT ON UPDATE CASCADE
)  ENGINE=INNODB;


/*-----------Exercicio 4D-----------*/

-- Activación da base de datos practicas1
use practicas1;
-- Creación da táboa grupo, se non existe
CREATE TABLE IF NOT EXISTS grupo (
    codGrupo SMALLINT UNSIGNED NOT NULL,
    nome VARCHAR(80) NOT NULL,
    cache MEDIUMINT UNSIGNED NOT NULL,
    dataFormacion DATE NOT NULL,
    PRIMARY KEY (codGrupo),
    INDEX idx_grupo_nome (nome)
)  ENGINE=INNODB;
-- Creación da táboa concerto, se non existe
CREATE TABLE IF NOT EXISTS concerto (
    codConcerto MEDIUMINT UNSIGNED NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    aforo MEDIUMINT UNSIGNED NOT NULL COMMENT 'numero máximo de espectadores',
    prezo DECIMAL(5 , 2 ) NOT NULL COMMENT 'prezo da entrada',
    PRIMARY KEY (codConcerto)
)  ENGINE=INNODB;
-- Creación da táboa actuacion que sae da transformación
-- da relación N:M nunha nova táboa
CREATE TABLE IF NOT EXISTS actuacion (
    codConcerto MEDIUMINT UNSIGNED NOT NULL,
    codGrupo SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (codConcerto , codGrupo),
    CONSTRAINT fk_actuacion_concerto FOREIGN KEY (codConcerto)
        REFERENCES concerto (codConcerto)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_actuacion_grupo FOREIGN KEY (codGrupo)
        REFERENCES grupo (codGrupo)
        ON DELETE RESTRICT ON UPDATE CASCADE
)  ENGINE=INNODB;


/*-----------Exercicio 4E-----------*/

-- Activación da base de datos practicas1
use practicas1;
-- Creación da táboa piso, se non existe
CREATE TABLE IF NOT EXISTS piso (
    codPiso SMALLINT UNSIGNED NOT NULL,
    domicilio VARCHAR(150) NOT NULL,
    localidade VARCHAR(80) NOT NULL,
    codPostal CHAR(5) NOT NULL,
    PRIMARY KEY (codPiso)
)  ENGINE=INNODB;
-- Creación da táboa contador, se non existe
CREATE TABLE IF NOT EXISTS contador (
    codContador MEDIUMINT UNSIGNED AUTO_INCREMENT NOT NULL,
    modelo ENUM('aeg235', 'samsung20', 'aeg55') NOT NULL,
    codPiso SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (codContador),
    CONSTRAINT fk_contador_piso FOREIGN KEY (codPiso)
        REFERENCES piso (codPiso)
        ON DELETE RESTRICT ON UPDATE CASCADE
)  ENGINE=INNODB;

/*-----------Exercicio 5-----------*/
use practicas1;
drop table if exists fabricante;
-- Tamén se podería executar nunha únca sentenza, cualifinaco o nome da táboa
drop table if exists practicas1.fabricante;

/*-----------Exercicio 6-----------*/

create index idx_concerto_nome
  		on concerto (nome);

/*-----------Exercicio 7-----------*/

drop index idx_concerto_nome on concerto;

/*-----------Exercicio 8-----------*/

-- Activación da base de datos practicas1
use practicas1;

-- Borrado da táboa película e táboas relacionadas
drop table if exists nacionalidade;
drop table if exists pelicula;

-- Creación da táboa pelicula, se non existe
CREATE TABLE IF NOT EXISTS pelicula (
    codPelicula SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    xenero VARCHAR(30),
    duracion DECIMAL(4 , 2 ) UNSIGNED,
    PRIMARY KEY (codPelicula)
)  ENGINE=INNODB;

-- Creación da táboa actor, se non existe
CREATE TABLE IF NOT EXISTS actor (
    idActor MEDIUMINT UNSIGNED NOT NULL,
    nome VARCHAR(40) NOT NULL,
    apelido1 VARCHAR(40),
    apelido2 VARCHAR(40),
    PRIMARY KEY (idActor)
)  ENGINE=INNODB;

-- Creación da táboa personaxe, se non existe
CREATE TABLE IF NOT EXISTS personaxe (
    codPersonaxe CHAR(10) NOT NULL,
    descricion VARCHAR(40) NOT NULL,
    PRIMARY KEY (codPersonaxe)
)  ENGINE=INNODB;
-- Creación da táboa roda que sae da transformación
-- da relación ternaria N:M:P nunha nova táboa, se non existe
CREATE TABLE IF NOT EXISTS roda (
    codRodaxe SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL,
    codPelicula SMALLINT UNSIGNED NOT NULL,
    idActor MEDIUMINT UNSIGNED NOT NULL,
    codPersonaxe CHAR(10) NOT NULL,
    PRIMARY KEY (codRodaxe),
    CONSTRAINT fk_roda_pelicula FOREIGN KEY (codPelicula)
        REFERENCES pelicula (codPelicula)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_roda_actor FOREIGN KEY (idActor)
        REFERENCES actor (idActor)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_roda_personaxe FOREIGN KEY (codPersonaxe)
        REFERENCES personaxe (codPersonaxe)
        ON DELETE RESTRICT ON UPDATE CASCADE
)  ENGINE=INNODB;

-- Creación do índice composto
create index idx_actor_apelido1_apelido2_nome on actor (apelido1,apelido2,nome);

-- Borrado do índice composto
drop index idx_actor_apelido1_apelido2_nome on actor;

-- Borrado da táboa roda
drop table roda;

/*-----------Exercicio 9-----------*/
-- BORRADO DA BASE DE DATOS, NO CASO QUE EXISTA
drop database if exists gabinete;

-- CREACIÓN DA BASE DE DATOS
create database if not exists gabinete
	character set utf8
	collate utf8_spanish_ci;
-- ou tamén
create schema if not exists gabinete
	default character set utf8
	collate utf8_spanish_ci ;

-- ACTIVACIÓN DA BASE DE DATOS
use gabinete;

-- CREACIÓN DAS TÁBOAS
CREATE TABLE cliente (
    dni CHAR(9) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    enderezo VARCHAR(150) NOT NULL,
    PRIMARY KEY (dni),
    KEY nome (nome)
)  ENGINE=INNODB;

CREATE TABLE telefono (
    dni CHAR(9) NOT NULL,
    telefono CHAR(12) NOT NULL,
    PRIMARY KEY (dni , telefono),
    CONSTRAINT fk_telefono_cliente FOREIGN KEY (dni)
        REFERENCES cliente (dni)
        ON DELETE CASCADE ON UPDATE CASCADE
)  ENGINE=INNODB;

CREATE TABLE avogado (
    dni CHAR(9) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    enderezo VARCHAR(150) NOT NULL,
    PRIMARY KEY (dni)
)  ENGINE=INNODB;

CREATE TABLE asunto (
    expediente INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    dataInicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descricion TEXT NOT NULL,
    dataArquivo DATE DEFAULT NULL,
    estado ENUM('recopilación', 'tramite', 'xuizo', 'arquivado') NOT NULL,
    dniCliente CHAR(9) NOT NULL,
    PRIMARY KEY (expediente),
    KEY dniCliente (dniCliente),
    CONSTRAINT fk_asunto_cliente FOREIGN KEY (dniCliente)
        REFERENCES cliente (dni)
        ON DELETE RESTRICT ON UPDATE CASCADE
)  ENGINE=INNODB;

CREATE TABLE avogado_asunto (
    dniAbogado CHAR(9) NOT NULL,
    expediente INT(10) UNSIGNED NOT NULL,
    PRIMARY KEY (dniAbogado , expediente),
    KEY expediente (expediente),
    CONSTRAINT fk_avogado_asunto_avogado FOREIGN KEY (dniAbogado)
        REFERENCES avogado (dni)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_avogado_asunto_asunto FOREIGN KEY (expediente)
        REFERENCES asunto (expediente)
        ON DELETE RESTRICT ON UPDATE CASCADE
)  ENGINE=INNODB;


