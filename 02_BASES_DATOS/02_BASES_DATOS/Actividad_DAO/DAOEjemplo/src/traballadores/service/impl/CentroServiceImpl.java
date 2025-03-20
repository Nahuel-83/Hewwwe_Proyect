package traballadores.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.DriverManager;
import java.util.List;

import traballadores.dao.CentroDAO;
import traballadores.dao.impl.CentroDAOImpl;
import traballadores.dao.util.ConnectionManager;
import traballadores.model.Centro;
import traballadores.service.CentroService;

// Implementación de los métodos de la interfaz CentroService
public class CentroServiceImpl implements CentroService {

	//declaramos el DAO correspondiente a Centro para solicitarle que haga las tareas correspondientes
	private CentroDAO dao = null;
	
	//Constructor, donde se instancia el dao
	public CentroServiceImpl(){
	
		dao=new CentroDAOImpl();
		
	}

	//Implementación del metodo buscar todos los centros.
	public List<Centro> findAll() throws Exception {

		//Declaramos un objeto connection
		Connection connection = null;
		
		try {
			/* Le asignamos una conexión. Esta tarea la hará la clase ConnectionManager
			 * que se encuentra en la carpeta traballadores/dao/util
			 */
			
			connection = ConnectionManager.getConnection();
						
			/*Esto sería otra forma de establecer una conexión con la BD sin pool de conexiones.
			* Class.forname registra el driver de conexión para la base de datos. Cada base de datos usa uno 
			* distinto
			* 
			* Class.forName("com.mysql.jdbc.Driver");
			* connection = DriverManager.getConnection ("jdbc:mysql://10.0.15.17/traballadores?useSSL=false","Pollo","pollo");
			*/
			
			/* Hacemos la llamada al método findAll de la capa de acceso a datos (implementada con el patrón 
			 * DAO. Este método devuelve un List<Centro>, y es lo que retorna el metodo findAll del servicio.
			 * Le pasamos la conexión. Es decir, fijaros que la conexión la abrimos en el servicio, y se la pasamos
			 * a la capa de datos (DAO)
			 */
			return dao.findAll(connection);

		} catch (SQLException e) {
			
			throw new Exception(e);
		} finally {
			//Importatísimo cerrar siempre la conexión 
			connection.close();
		}

	}
	
	// Método que realiza la inserción de un centro en la base de datos Traballadores.
	public int addCentro(Centro c) throws Exception{
		Connection connection = null;

		try {
			
			connection = ConnectionManager.getConnection();
			
			//Hacemos la llamada al metodo addCentro de la capa de Datos. En este caso le pasamos la conexión y el centro que queremos añadir.
			//Esto nos retorna un entero que será el número de filas insertadas. De alguna forma, podemos comprobar si inserto algo o no.
			//Este valor se lo retornamos a la capa de aplicación, es decir, a quien llamó a este método.
			int filasInsertadas = dao.addCentro(connection, c);
			return filasInsertadas;

		} catch (SQLException e) {
			throw new Exception(e);
		} finally {
			//Importatisimo cerrar siempre la conexión.
			connection.close();
		}
	}

}
