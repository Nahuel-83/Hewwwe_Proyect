-- Tarefa 9.2
/*BORRADO DA BASE DE DATOS, NO CASO QUE EXISTA 
(só cando se están facendo probas)*/
drop database if exists gabinete;

/* CREACIÓN DA BASE DE DATOS*/
create database if not exists gabinete   
	character set utf8
	collate utf8_spanish_ci;
/* ou tamén */
create schema if not exists gabinete 
	default character set utf8
	collate utf8_spanish_ci ;

/* ACTIVACIÓN DA BASE DE DATOS */
use gabinete;

/* CREACIÓN DAS TÁBOAS */
create table cliente (
dni char(9)  not null,
nome varchar(100)  not null,
enderezo varchar(150)  not null,
primary key (dni),
key nome (nome)
) engine=innodb ;

create table telefono (
dni char(9)  not null,
telefono char(12)  not null,
primary key (dni,telefono),
constraint fk_telefono_cliente foreign key (dni) 
	references cliente (dni)
	on delete cascade
	on update cascade
) engine=innodb ;

create table avogado (
dni char(9)  not null,
nome varchar(100)  not null,
enderezo varchar(150)  not null,
primary key (dni)
) engine=innodb ;

create table asunto (
expediente int(10) unsigned not null auto_increment,
dataInicio datetime not null default current_timestamp,
descricion text  not null,
dataArquivo date default null,
estado enum('recopilación','tramite','xuizo','arquivado')  not null,
dniCliente char(9) not null,
primary key (expediente),
key dniCliente (dniCliente),
constraint fk_asunto_cliente foreign key (dniCliente)
	references cliente (dni) 
	on delete restrict
	on update cascade
) engine=innodb ;

create table avogado_asunto (
dniAbogado char(9)  not null,
expediente int(10) unsigned not null,
primary key (dniAbogado,expediente),
key expediente (expediente),
constraint fk_avogado_asunto_avogado foreign key (dniAbogado)
	references avogado (dni)
	on delete restrict
	on update cascade,
constraint fk_avogado_asunto_asunto foreign key (expediente)
	references asunto (expediente)
	on delete restrict
	on update cascade
) engine=innodb ;
