/*creación da base de datos se non existe*/
create database if not exists eleccionModulos   
	character set utf8
	collate utf8_spanish_ci;
/* ou tamén */
create schema if not exists eleccionModulos   
	character set utf8
	collate utf8_spanish_ci;
/*activar vase de datos*/
use eleccionModulos;
/* TÁBOA profesor */
create table profesor (
idProfesor char(15) not null,
corpo enum('S','T') not null,
nrp char(20) not null,
nome varchar(30) not null,
apelidos varchar(60) not null,
horasLectivas smallint unsigned default 18,
primary key (idProfesor),
unique key (nrp),
index idx_profesor_apelidos (apelidos)
)engine=InnoDB;
/* TÁBOA grupo*/
create table grupo (
idGrupo char(15),
descricion varchar(100) not null,
horasTitoria smallint unsigned,
idProfesor char(15),
primary key (idGrupo)
)engine=InnoDB;
/* TÁBOA modulo*/
create table modulo (
idModulo char(6),
horasSemanais smallint unsigned,
descricion varchar(100) not null,
corpo enum('S','T'),
primary key (idModulo)
)engine=InnoDB;
/* TÁBOA imparte */
create table imparte (
idModulo char(6),
idGrupo char(15),
idProfesor char(15),
primary key (idGrupo,idModulo,idProfesor)
)engine=InnoDB;
-- Tarefa 4.2
/* Definición das relacións entre as táboas: RESTRICIÓNS DE CLAVE FORÁNEA */
alter table grupo
add constraint fk_grupo_profesor foreign key (idProfesor) REFERENCES profesor (idProfesor)
	on delete restrict
	on update cascade;
alter table imparte
add constraint fk_imparte_modulo foreign key (idModulo) REFERENCES modulo (idModulo)
	on delete restrict
	on update cascade,
add constraint fk_imparte_profesor foreign key (idProfesor) REFERENCES profesor (idProfesor)
	on delete restrict
	on update cascade,
add constraint fk_imparte_grupo foreign key (idGrupo) REFERENCES grupo (idGrupo)
	on delete restrict
	on update cascade;

