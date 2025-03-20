/*creación da base de datos, no caso de que non exista*/
create  database if not exists musica
	default character set utf8
	collate utf8_spanish_ci ;
/*activación da base de datos*/
use musica;
/*borrar táboas, no caso de que existan*/
drop table if exists cancion, disco, discográfica;
/*creación da táboa discografica*/
create table discografica
(
id		char(5) not null,
nome 	varchar(80) not null,
primary key (id)
) engine = innodb;
/*creación da táboa disco*/
create table disco
(
id		smallint unsigned not null,
titulo	varchar(80)	not null,
autor	char(3),
id_discografica char(5) not null,
primary key (id)
) engine = innodb;
/*creación da táboa cancion*/
create table cancion
(
id_disco		smallint unsigned not null,
numero_pista	tinyint unsigned not null,
titulo			varchar(90) not null,
duracion		decimal(5,2),
primary key (id_disco, numero_pista)
) engine = innodb;

