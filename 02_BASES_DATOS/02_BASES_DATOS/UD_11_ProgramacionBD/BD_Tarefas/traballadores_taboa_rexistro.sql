/*
Creación dunha táboa para levar un rexistro de todas as operacións
que se realicen sobre as táboas da base de datos de traballadores. Cada
operación de manipulación de datos (insert, update, delete) rexistrarase
nesta táboa de forma automática, creando os disparadores necesarios.
*/

create table if not exists traballadores.rexistroOperacions
(
idOperacion integer unsigned not null auto_increment,
usuario char(100),      # usuario que fai oa modificación
dataHora datetime,		# data e hora na que se fai a modificación
taboa char(50),			# táboa na que se fai a modificación
operacion char(6),		# operación de modificación: INSERT, UPDATE, DELETE
primary key (idOperacion)
)engine = myisam;