SELECT * FROM tendaBD.detalle_vendas order by dev_venda asc;

insert into detalle_vendas (dev_venda, dev_numero, dev_artigo, dev_cantidade, dev_prezo_unitario,dev_desconto)
values (6,20,'07714M0',1,146.62,1);

ALTER DATABASE tendabd CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
-- ALTER TABLE detalle_vendas CONVERT TO CHARACTER SET latin1 COLLATE latin1_spanish_ci;

select dev_venda, dev_numero, dev_artigo, sum(dev_cantidade)
from detalle_vendas
where dev_venda=6 and dev_artigo= '07714M0'
group by dev_venda,dev_numero,dev_artigo;

select sum(dev_cantidade) 
from detalle_vendas where dev_venda=6 and dev_artigo= '07714M0';

insert into detalle_vendas
values (6,20,'07714M0',1,146.62,1);

set @cant_devuelta=2;
-- set @artigo=
drop procedure devolucionArtigoVenda;
delimiter //
create procedure devolucionArtigoVenda(in num_venda int, in artigo char(8), in cantidadDev int)
begin
	declare numArtigosCompradosReal int default 0; -- numero artigos que realmente se compraron e están en detallevendas.
    declare cursorid_Venda int; -- variable na que gardamos o id da venda dunha fila do cursor.
    declare cursornum_Linea int; -- variable na que gardamos o num_linea dunha fila do cursor. 
    declare cursor_totArtigosLinea int; -- variable na que gardamos o total de artigos dunha fila do cursor.
    
    declare cantidadActualizar int; -- cantidade que usaremos no set da sentenza update
    declare faltanDevolver int;  -- cantidade que falta ainda por devolver ou o que é o mesmo, actualizar en detalle de vendas coa sentenza update.
    
    declare vFinal integer default 0;
   --  declare 
    declare cursorDetalleVendas cursor for 
		select dev_venda, dev_numero, sum(dev_cantidade)
		from detalle_vendas
		where dev_venda=num_venda and dev_artigo= artigo
		group by dev_venda,dev_numero,dev_artigo;
        
    declare continue handler for not found set vFinal=1;   
    
    -- esta select non a usamos
    
    -- select sum(dev_cantidade) into numArtigosCompradosReal
	-- from detalle_vendas where dev_venda= num_venda and dev_artigo= artigo;
    -- if cantidadDev<=numArtigosComprados then -- hacemos la gestión de la devolución
    open cursorDetalleVendas;
	repeat
	fetch cursorDetalleVendas into cursorid_Venda, cursornum_Linea, cursor_totArtigosLinea;
    if vFinal=0 then -- si no se llegó al final de cursor
	 
		if cantidadDev<>0 then  -- A cantidade que quere devolver é distinto de cero. esta cantidade comeza sendo que  vaise actualizando en
							-- función do xa devolto.
			if cursor_totArtigosLinea >= cantidadDev then
				set cantidadActualizar = cursor_totArtigosLinea-cantidadDev;
				set cantidadDev=0;
				update detalle_vendas
					set dev_cantidade = cantidadActualizar
					where dev_venda=cursorid_Venda and dev_numero=cursornum_Linea;
			else 
				set cantidadActualizar = 0;   
				set cantidadDev=cantidadDev-cursor_totArtigosLinea;
				update detalle_vendas
					set dev_cantidade = cantidadActualizar
					where dev_venda=cursorid_Venda and dev_numero=cursornum_Linea;
			end if;
		end if;
    end if;
	until vFinal=1 end repeat;
end
//
delimiter ;


-- Probamos o procedemento, facendo chamadas o mesmo simulando devolucións do artigo que temos de proba.
call devolucionArtigoVenda(6,'07714M0',5);
select @@character_set_client;

    
    
    