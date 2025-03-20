package traballadores.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import traballadores.dao.CentroDAO;
//import traballadores.dao.util.JDBCUtils;
import traballadores.model.Centro;

public class CentroDAOImpl implements CentroDAO {
	
	// Metodo que recupera de la base de datos todos los centros de la tabla centros. Le pasamos la conexión con la BD
	@Override
	public List<Centro> findAll(Connection connection) throws SQLException {
		//La clase preparedStatement que nos sirve para ejecutar sentencias SQL que pueden estár parametrizadas
		PreparedStatement preparedStatement = null;
		//Objeto resultset, que almacenará los resultados
		ResultSet resultSet = null;

		try {
			
			//Creamos el string que contiene la sentencia a ejecutar. En este caso no contiene parámetros.
			String queryString = 
				"SELECT cenNumero, cenNome, cenEnderezo " + 
						"FROM Centro c";
			
			
			preparedStatement = connection.prepareStatement(queryString,
					ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			
			// Ejecutamos la sentencia y nos devuelve un ResultSet que asignamos en la variable resultset.
			// El resultset es la tabla de resultados. Hay que recorrerlo y acceder a cada columna para recuperar los datos 
			resultSet = preparedStatement.executeQuery();
			
			// Lista de centros donde iremos cargando los objetos Centro una vez que recuperamos las filas del Resultset. Cada fila es un centro
			List<Centro> results = new ArrayList<Centro>();                        
			Centro t = null;
			
			// Recorremos el resultset. La primera vez, el cursor que recorre el método resultset está posicionado antes de la primera fila.
			// Por lo tanto, la primera vez que se ejecuta coloca el cursor en la primera fila. Además devuelve falso si el cursor se posiciona
			// despues de la ultima fila. Así controlaremos el recorrido del resultSet.
			
			if (resultSet.next()){
			do {
					//Llamamos al metodo loadNext que recupera el Centro en el que esté posicionado en ese momento el resultset
					t = loadNext(resultSet);
					results.add(t);               	
					             	
				} while (resultSet.next()) ;
			}

			return results;

		} catch (SQLException e) {
			throw new SQLException(e);
		} finally {
			// IMPORTANTISIMO: Cerrar el resultSet y el prepardStatement.
			resultSet.close();
			preparedStatement.close();
		}
	}
	
	//Inserta un nuevo Centro
	
	public int addCentro(Connection connection, Centro c) throws SQLException{
		
		PreparedStatement preparedStatement = null;
		try {          

			// Creamos el string que pasaremos al preparedStatement. En este caso es parametrizado. Lo indicamos con ?
			String queryString = "INSERT INTO Centro(cenNumero, cenNome,cenEnderezo) "
					+ "VALUES (?, ?, ?)";

			preparedStatement = connection.prepareStatement(queryString);

			// Rellenamos el "preparedStatement" con los valores del objeto centro. Recuerda que los valores a insertar los rellenamos en la aplicacion principal
			// que simula nuestra capa de aplicación.
			
			//Para rellenar el PreparedStatement parametrizado, comenzamos por la posicion 1 y seguimos. La posición 1 corresponde con la primera ?, la 2 con la segunda ?
			//y así sucesivamente.
			int i = 1;    
			preparedStatement.setInt(i++, c.getNumero());
			preparedStatement.setString(i++, c.getNome());
			preparedStatement.setString(i++, c.getEnderezo());
			
			// Ejecutamos la sentencia de inserción. Nos devuelve un entero con el numero de filas insertadas.
			int filasInsertadas = preparedStatement.executeUpdate();

			if (filasInsertadas == 0) {
				throw new SQLException("No se ha podido insertar el usuario'");
			}

			//Devolvemos el numero de filas que se inserta. En la capa de aplicación podremos indicar al usuario si la inserción realizada o no comprobando si se
			//inserto una fila
			return filasInsertadas;

		} catch (SQLException e) {
			throw new SQLException(e);
		} finally {
			preparedStatement.close();
		}
	}
	
	//Metodo que recupera la fila del resultset a la que apunta el cursor de recorrido del mismo y lo carga en el objeto centro 
	private Centro loadNext(ResultSet resultSet) 
			throws SQLException {

		int i = 1;
		int numero = resultSet.getInt(i++);
		String nome = resultSet.getString(i++);
		String enderezo= resultSet.getString(i++);
		
		Centro c = new Centro();
		c.setNumero(numero);
		c.setNome(nome);
		c.setEnderezo(enderezo);

		return c;
	}

}
