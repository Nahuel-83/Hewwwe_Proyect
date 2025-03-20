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

// Implementaci�n de los m�todos de la interfaz CentroService
public class CentroServiceImpl implements CentroService {

	//declaramos el DAO correspondiente a Centro para solicitarle que haga las tareas correspondientes
	private CentroDAO dao = null;
	
	//Constructor, donde se instancia el dao
	public CentroServiceImpl(){
	
		dao=new CentroDAOImpl();
		
	}

	//Implementaci�n del metodo buscar todos los centros.
	public List<Centro> findAll() throws Exception {

		//Declaramos un objeto connection
		Connection connection = null;
		
		try {
			/* Le asignamos una conexi�n. Esta tarea la har� la clase ConnectionManager
			 * que se encuentra en la carpeta traballadores/dao/util
			 */
			
			connection = ConnectionManager.getConnection();
						
			/*Esto ser�a otra forma de establecer una conexi�n con la BD sin pool de conexiones.
			* Class.forname registra el driver de conexi�n para la base de datos. Cada base de datos usa uno 
			* distinto
			* 
			* Class.forName("com.mysql.jdbc.Driver");
			* connection = DriverManager.getConnection ("jdbc:mysql://10.0.15.17/traballadores?useSSL=false","Pollo","pollo");
			*/
			
			/* Hacemos la llamada al m�todo findAll de la capa de acceso a datos (implementada con el patr�n 
			 * DAO. Este m�todo devuelve un List<Centro>, y es lo que retorna el metodo findAll del servicio.
			 * Le pasamos la conexi�n. Es decir, fijaros que la conexi�n la abrimos en el servicio, y se la pasamos
			 * a la capa de datos (DAO)
			 */
			return dao.findAll(connection);

		} catch (SQLException e) {
			
			throw new Exception(e);
		} finally {
			//Importat�simo cerrar siempre la conexi�n 
			connection.close();
		}

	}
	
	// M�todo que realiza la inserci�n de un centro en la base de datos Traballadores.
	public int addCentro(Centro c) throws Exception{
		Connection connection = null;

		try {
			
			connection = ConnectionManager.getConnection();
			
			//Hacemos la llamada al metodo addCentro de la capa de Datos. En este caso le pasamos la conexi�n y el centro que queremos a�adir.
			//Esto nos retorna un entero que ser� el n�mero de filas insertadas. De alguna forma, podemos comprobar si inserto algo o no.
			//Este valor se lo retornamos a la capa de aplicaci�n, es decir, a quien llam� a este m�todo.
			int filasInsertadas = dao.addCentro(connection, c);
			return filasInsertadas;

		} catch (SQLException e) {
			throw new Exception(e);
		} finally {
			//Importatisimo cerrar siempre la conexi�n.
			connection.close();
		}
	}

}
