-- modificar la tabla vendas
alter table vendas 
add column ven_total decimal(10,2) not null default 0;

-- consulta que recupera los datos de detalle vendas
select dev_venda, dev_numero, dev_artigo, dev_cantidade, dev_prezo_unitario, dev_desconto from detalle_vendas order by dev_venda;

-- creamos el procedimiento almacenado sobre na bd tendaBD.alter
drop procedure if exists calcTotalVenda;
delimiter //
create procedure calcTotalVenda()
begin
	-- declaro las variables que contendran los datos de cada campo de detalle de ventas cuando recorra el cursor.
	declare vdev_venda int default 0;
    declare vdev_numero tinyint default 0;
    declare vdev_artigo char(8) default '';
    declare vdev_cantidade smallint default 0;
    declare vdev_prezo_unitario decimal(8,2) default 0;
    declare vdev_desconto tinyint default 0;
    -- declaro una variable para llevar el control de la venta que se está procesando en el cursor.
    declare vVentaActual int default -1;
    -- declaro una variable para almacenar el total de una linea de venta
    declare vTotalLineaVenda decimal(10,2) default 0;
    -- declaro a variable donde gardo o importe total de cada venda
    declare vTotalVenda decimal(10,2) default 0;

	declare vFinal integer default 0;
   --  declare 
    declare cursorDetalleVendas cursor for select dev_venda, dev_numero, dev_artigo, dev_cantidade, dev_prezo_unitario, dev_desconto from detalle_vendas order by dev_venda;
    
    declare continue handler for not found set vFinal=1;
    
    open cursorDetalleVendas;
    repeat
		fetch cursorDetalleVendas into vdev_venda,vdev_numero,vdev_artigo,vdev_cantidade,vdev_prezo_unitario,vdev_desconto;
        if vFinal=0 then -- si no se llegó al final de cursor
			if vdev_venda <> vVentaActual then
				if vVentaActual <> -1 then
					update vendas set ven_total = vTotalVenda where ven_id=vVentaActual;
                end if;
				set vVentaActual = vdev_venda;
                set vTotalVenda = 0;
			end if;
            -- calculamos el total de un articulo y una venta
            set vTotalLineaVenda= (vdev_cantidade*vdev_prezo_unitario) - ((vdev_cantidade*vdev_prezo_unitario)*vdev_desconto)/100;
            set vTotalVenda=vTotalVenda+vTotalLineaVenda;
			set vTotalLineaVenda=0;
			
		end if;
        if vFinal=1 then update vendas set ven_total = vTotalVenda where ven_id=vVentaActual;
        end if;
    until vFinal=1 end repeat;
	
end
//
delimiter ;

call calcTotalVenda();

