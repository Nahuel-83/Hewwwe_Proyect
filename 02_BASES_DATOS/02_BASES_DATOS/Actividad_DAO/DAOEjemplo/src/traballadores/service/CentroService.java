package traballadores.service;

import java.util.List;

import traballadores.model.Centro;

public interface CentroService {
	
	// Busqueda de todos los centros
	public List<Centro> findAll() 
	    	throws Exception;
	
	// Inserta un centro
	public int addCentro (Centro c) throws Exception;

}
