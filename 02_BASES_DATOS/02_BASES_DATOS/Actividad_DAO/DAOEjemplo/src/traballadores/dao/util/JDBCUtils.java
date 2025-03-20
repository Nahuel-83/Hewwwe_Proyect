package traballadores.dao.util;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

// import com.gzone.ecommerce.exceptions.DataException;

/**
 * Factoriza los bloques de código habituales de JDBC 
 * que deben colocarse en los bloques <code>finally { ... }</code>.
 *
 * @author https://www.linkedin.com/in/joseantoniolopezperez
 * @version 0.2
 */
public final class JDBCUtils {

	private JDBCUtils() {}

	/**
     * Cierra el ResultSet.
     */
	public static void closeResultSet(ResultSet resultSet)
		throws SQLException {

		if (resultSet != null) {
			try {
				resultSet.close();
			} catch (SQLException e) {
				throw new SQLException(e);
			}
		}

	}

	/**
     * Cierra el Statement.
     */
	public static void closeStatement(Statement statement)
		throws SQLException {

		if (statement != null) {
			try {
				statement.close();
			} catch (SQLException e) {
				throw new SQLException(e);
			}
		}

	}

	/**
	 * Cierra la conexion.
	 * 
	 * Metodo de cierre <b>para el caso de sentencias con autocommit = true</b>.
	 * 
	 * En caso de autocommit = false debería usarse: 
	 * {@link #closeConnection(Connection, Boolean)} 
	 * para que ejecute previamente commit() o rollback() 
	 * previamente al cierre.
	 * 
	 * @param connection Conexion a cerrar.

	 */
	public static void closeConnection(Connection connection)
			throws SQLException {
		
		if (connection != null) {
			try {
				// Previene un mal uso 
				if (!connection.getAutoCommit()) {
					throw new SQLException("Autocommit disabled. Commit or Rollback should be done explicitly.");
				}			
				
				connection.close();
			} catch (SQLException e) {
				throw new SQLException(e);
			}
		}
	}
	
	/**
	 * Metodo de finalización de transacción <b>para el caso de autocommit = false</b>
	 * y de cierre de conexión.
	 *  
	 * Ejecuta commit() o rollback() y a continuacion cierra la conexión.
	 *  
	 * @param connection Conexión a cerrar.
	 * @param commitOrRollback Si es true ejecuta commit() y en caso contrario ejecuta rollback().
	 */
	public static void closeConnection(Connection connection, boolean commitOrRollback)
		throws SQLException {
        try {
            if (connection != null) {
                if (commitOrRollback) {
                	connection.commit();
                } else {
                	connection.rollback();                        
                }
                connection.close();
            }
        } catch (SQLException e) {
            throw new SQLException(e);
        }
	}

}
