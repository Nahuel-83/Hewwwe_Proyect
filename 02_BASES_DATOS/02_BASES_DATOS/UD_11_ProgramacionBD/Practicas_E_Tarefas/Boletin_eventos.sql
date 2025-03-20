-- Boletín 4. Eventos
-- Tarefa 1
-- habilitar o planificador de eventos
set global event_scheduler = on;
-- crear o evento
delimiter //
create event traballadores.actualizar_depEmpregados
  on schedule every 1 hour
  starts now() + interval 12 hour
do 
begin 
   call sp_actualizar_depEmpregados();
end
//
delimiter ;

-- Tarefa 2
-- habilitar o planificador de eventos
set global event_scheduler = on;
-- crear o evento
drop event if exists tendabd.peche_anual_vendas; 
delimiter //
create event tendabd.peche_anual_vendas
on schedule at '2021-01-01 00:00:00'
do 
begin 
   /*Inserción: faise a inserción das filas que hai que copiar nos táboas coa
     información histórica*/
   insert into hvendas (hven_id,hven_tenda,hven_empregado,hven_cliente,hven_data)
      select ven_id,ven_tenda,ven_empregado,ven_cliente,ven_data 
       from vendas
       where ven_factura is not null;
       
	insert into hdetalle_vendas(hdet_venda, hdet_numero, hdet_artigo, hdet_cantidade, hdet_importe)
      select dev_venda, dev_numero, dev_artigo, dev_cantidade, 
	    	(dev_prezo_unitario*dev_cantidade)*dev_desconto/10 # Cálculo de hdet_importe
        from detalle_vendas
        where dev_venda in (select ven_id from vendas where ven_factura is not null);
   /*Borrado: bórranse primeiro as liñas de detalle das vendas porque hai que utilizar 
   información das vendas que hai que borrar na subconsulta*/
   delete from detalle_vendas  
     where dev_venda in (select ven_id from vendas where ven_factura is not null);
   delete from vendas 
     where ven_factura is not null;
end
//
delimiter ;
