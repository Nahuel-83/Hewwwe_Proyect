/*creacion da base de datos exame_probas */
create database exame_probas
	default character set utf8
	default collate utf8_spanish_ci ;
use exame_probas;
create table hotel (
  codigo integer unsigned not null auto_increment,
  cif char(9) not null,
  nome varchar(60) not null,
  email varchar(100) default null,
  primary key  (codigo),
  unique (cif)
) engine=innodb;
create table habitacion (
  hotel integer unsigned not null,
  numero smallint(6) not null,
  tipo enum('M','D','I','S') not null,
  supletoria enum('S','N') not null default 'N',
  prezo decimal(6,2) unsigned not null,
  primary key  (hotel,numero)
) engine=innodb;
/* Definición das relacións entre as táboas*/
alter table habitacion  
	add constraint fk_habitacion_hotel foreign key (hotel) references  hotel (codigo)	
        on delete restrict 
        on update cascade;
/* Inserción de datos*/
insert into hotel (cif,nome,email) values
('A15002545','Hotel Almirante','info@hotelalmirante.com'),
('A32500124','Hotel San Martín','sanmartin@sanmartin.es'),
('A36325889','Hotel Peregrina','info@peregrina.es'),
('B27001200','Hotel Lugo','reservas@hotellugo.ga');
insert into habitacion (hotel,numero,tipo,supletoria,prezo) values
(1,101,'M','N',80),(1,102,'I','N',50),(2,1,'S','N',120),(3,11,'M','N',75),
(4,101,'D','S',85),(4,102,'D','N',80),(4,103,'M','N',90);
