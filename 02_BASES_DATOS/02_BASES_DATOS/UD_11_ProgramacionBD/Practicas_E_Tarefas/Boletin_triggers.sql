-- Boletín 3
-- Tarefa 1

drop trigger if exists tendabd.vendasAI;
delimiter //
create trigger tendabd.vendasAI after insert on tendabd.vendas
for each row
begin
update clientes
  set clt_vendas = ifnull(clt_vendas,0)+1,
      clt_ultima_venda = date(new.ven_data)
  where clt_id = new.ven_cliente;
end
//
delimiter ;

-- disparador que actualiza as columnas clt_vendas e clt_ultima_venda despois de 
-- modificar unha fila na táboa de vendas
drop trigger if exists tendabd.vendasAU;
delimiter //
create trigger tendabd.vendasAU after update on tendabd.vendas
for each row
begin
-- actualización da columna clt_vendas
if old.ven_cliente != new.ven_cliente then
  update clientes
    set clt_vendas = clt_vendas-1
    where clt_id = old.ven_cliente;
  update clientes
    set clt_vendas = clt_vendas+1
    where clt_id = new.ven_cliente;
end if;
-- actualización da columna clt_ultima_venda
if new.ven_data > (select clt_ultima_venda 
						from clientes 
                        where clt_id = new.ven_cliente)
then
  update clientes
    set clt_ultima_venda = date(new.ven_data)
    where clt_id = new.ven_cliente;
end if;
end
//
delimiter ;

-- disparador que actualiza as columnas clt_vendas e clt_ultima_venda despois de 
-- borrar unha fila na táboa de vendas
drop trigger if exists tendabd.vendasAD;
delimiter //
create trigger tendabd.vendasAD after delete on tendabd.vendas
for each row
begin
-- actualización da columna clt_vendas
  update clientes
    set clt_vendas = clt_vendas-1
    where clt_id = old.ven_cliente;
-- actualización da columna clt_ultima_venda
if date(old.ven_data) = (select clt_ultima_venda 
						from clientes 
						where clt_id = old.ven_cliente)
   and (select count(*) 
		from vendas 
		where ven_cliente=old.ven_cliente
			and date(ven_data) = date(old.ven_data)) = 0
then
  update clientes
    set clt_ultima_venda = (select max(date(ven_data)) from vendas 
							where ven_cliente=old.ven_cliente
                            and date(ven_data) != date(old.ven_data))
    where clt_id = old.ven_cliente;
end if;
end
//
delimiter ;


-- Tarefa 2

/*
Creación dunha táboa para levar un rexistro de todas as operacións
que se realicen sobre as táboas da base de datos de traballadores. Cada
operación de manipulación de datos (insert, update, delete) rexistrarase
nesta táboa de forma automática, creando os disparadores necesarios.
*/
CREATE TABLE IF NOT EXISTS traballadores.rexistroOperacions (
    idOperacion INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario CHAR(100),
    dataHora DATETIME,
    taboa CHAR(50),
    operacion CHAR(6),
    PRIMARY KEY (idOperacion)
)  ENGINE=MYISAM

-- Código de creación do disparador asociado á operación AFTER DELETE da táboa departamento
delimiter //
create trigger traballadores.departamentoAD after delete on departamento
for each row
begin
insert into traballadores.rexistroOperacions (usuario, dataHora, taboa, operacion)
    values (user(),now(),'departamento','delete');
end
//
delimiter ;

-- Código de creación do disparador asociado á operación AFTER INSERT da táboa departamento
delimiter //
create trigger traballadores.departamentoAI after insert on departamento
for each row
begin
insert into traballadores.rexistroOperacions (usuario, dataHora, taboa, operacion)
    values (user(),now(),'departamento','insert');
end
//
delimiter ;

-- Código de creación do disparador asociado á operación AFTER UPDATE da táboa departamento

delimiter //
create trigger traballadores.departamentoAU after update on departamento
for each row
begin
insert into traballadores.rexistroOperacions (usuario, dataHora, taboa, operacion)
    values (user(),now(),'departamento','update');
end
//
delimiter ;

-- O resto dos disparadores para as táboas empregado e centro terían un código similar ao anterior da táboa departamento

