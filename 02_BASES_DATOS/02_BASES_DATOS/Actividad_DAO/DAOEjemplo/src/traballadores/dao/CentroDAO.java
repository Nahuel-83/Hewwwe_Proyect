package traballadores.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import traballadores.model.Centro;

public interface CentroDAO {
	
	// Lista todos los centros
	public List<Centro> findAll(Connection con) throws SQLException;
	
	// Inserta un nuevo centro
	public int addCentro(Connection con, Centro c) throws SQLException;
	
	

}
