/*-----------------------------------
-------------------------------------
Solucións do boletín de exercicios 2
-------------------------------------
-------------------------------------*/

/*-----------Exercicio 1-----------*/
alter database practicas1
    character set latin1
    collate latin1_general_ci;


/*-----------Exercicio 2A-----------*/
-- cambios na táboa de fabricante
alter table fabricante
  add column email varchar(150) default null,
  add column cif char(9) not null after idFabricante,
  add index idx_fabicante_cif (cif),
  engine = Innodb;


/*-----------Exercicio 2B-----------*/
-- cambios na táboa de fabricante
alter table fabricante
	add primary key (cif),
	drop column idFabricante,
	drop index idx_fabricante_nome;

/*-----------Exercicio 2C-----------*/
-- cambios na táboa grupo
alter table grupo
  change cache custo mediumint unsigned,
  alter dataFormacion set default 0;
  

/*-----------Exercicio 3-----------*/
use practicas1;

drop table if exists empregado;
drop table if exists departamento;

-- creación das táboas
CREATE TABLE empregado (
    dni CHAR(9) NOT NULL,
    nss CHAR(10) NOT NULL,
    nome VARCHAR(80) NOT NULL,
    dataNacemento DATE,
    sexo ENUM('h', 'm') COMMENT 'h = home, m = muller',
    salario DECIMAL(11 , 2 ) UNSIGNED,
    codigoDepartamento SMALLINT UNSIGNED,
    PRIMARY KEY (dni),
    INDEX idx_empregado_nss (nss)
);

CREATE TABLE departamento (
    codigoDepartamento SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL,
    nome VARCHAR(60) NOT NULL,
    localizacion VARCHAR(40),
    dniXefe CHAR(9),
    PRIMARY KEY (codigoDepartamento)
);

-- engadir as restriccións de clave foránea par reprentar as relacións
alter table empregado
add constraint fk_empregado_departamento foreign key (codigoDepartamento) 
  references departamento(codigoDepartamento)
	on delete set null
	on update cascade;
alter table departamento
add constraint fk_departamento_empregado foreign key (dniXefe) 
	references empregado(dni)
	on delete set null
	on update cascade;

-- desactivar a verificación de claves foráneas
set FOREIGN_KEY_CHECKS = 0;
use practicas1;
drop table if exists empregado;
drop table if exists departamento;
CREATE TABLE empregado (
    dni CHAR(9) NOT NULL,
    nss CHAR(10) NOT NULL,
    nome VARCHAR(80) NOT NULL,
    dataNacemento DATE,
    sexo ENUM('h', 'm') COMMENT 'h = home, m = muller',
    salario DECIMAL(11 , 2 ) UNSIGNED,
    PRIMARY KEY (dni),
    INDEX idx_empregado_nss (nss),
    codigoDepartamento SMALLINT UNSIGNED,
    CONSTRAINT fk_empregado_departamento FOREIGN KEY (codigoDepartamento)
        REFERENCES departamento (codigoDepartamento)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE departamento (
    codigoDepartamento SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL,
    nome VARCHAR(60) NOT NULL,
    localizacion VARCHAR(40),
    dniXefe CHAR(9),
    PRIMARY KEY (codigoDepartamento),
    CONSTRAINT fk_departamento_empregado FOREIGN KEY (dniXefe)
        REFERENCES empregado (dni)
        ON DELETE SET NULL ON UPDATE CASCADE
);
-- activar a verificación de claves foráneas
set FOREIGN_KEY_CHECKS = 1;


/*-----------Exercicio 4A-----------*/

-- borrado da base de datos, se existe (só cando se están facendo probas)
drop database if exists eleccionModulos;
-- creación da base de datos se non existe
create database if not exists eleccionModulos   
	character set utf8
	collate utf8_spanish_ci;
-- ou tamén 
create schema if not exists eleccionModulos   
	character set utf8
	collate utf8_spanish_ci;

-- activar base de datos
use eleccionModulos;

-- TÁBOA profesor
CREATE TABLE profesor (
    idProfesor CHAR(15) NOT NULL,
    corpo ENUM('S', 'T') NOT NULL,
    nrp CHAR(20) NOT NULL,
    nome VARCHAR(30) NOT NULL,
    apelidos VARCHAR(60) NOT NULL,
    horasLectivas SMALLINT UNSIGNED DEFAULT 18,
    PRIMARY KEY (idProfesor),
    UNIQUE KEY (nrp)
)  ENGINE=INNODB;

-- TÁBOA grupo
CREATE TABLE grupo (
    idGrupo CHAR(15),
    descricion VARCHAR(100) NOT NULL,
    horasTitoria SMALLINT UNSIGNED,
    idProfesor CHAR(15),
    PRIMARY KEY (idGrupo)
)  ENGINE=INNODB;

-- TÁBOA modulo
CREATE TABLE modulo (
    idModulo CHAR(6),
    horasSemanais SMALLINT UNSIGNED,
    descricion VARCHAR(100) NOT NULL,
    corpo ENUM('S', 'T'),
    PRIMARY KEY (idModulo)
)  ENGINE=INNODB;

-- TÁBOA imparte
CREATE TABLE imparte (
    idModulo CHAR(6),
    idGrupo CHAR(15),
    idProfesor CHAR(15),
    PRIMARY KEY (idGrupo , idModulo , idProfesor)
)  ENGINE=INNODB;

/*-----------Exercicio 4B-----------*/

-- Definición das relacións entre as táboas: RESTRICIÓNS DE CLAVE FORÁNEA
alter table grupo
add constraint fk_grupo_profesor foreign key (idprofesor) 
	references profesor (idprofesor)
	on delete restrict
	on update cascade;
alter table imparte
add constraint fk_imparte_modulo foreign key (idmodulo)
	references modulo (idmodulo)
	on delete restrict
	on update cascade,
add constraint fk_imparte_profesor foreign key (idprofesor) 
	references profesor (idprofesor)
	on delete restrict
	on update cascade,
add constraint fk_impate_grupo foreign key (idgrupo) 
	references grupo (idgrupo)
	on delete restrict
	on update cascade;

