package traballadores.dao.util;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ResourceBundle;

// pool de conexiones
import com.mchange.v2.c3p0.ComboPooledDataSource;

/*
 * Clase que implementa un pool de conexiones. Será la encargada de servir connexiones cada vez que la capa de servicio las necesite
 * para alguna operación que se le solicite.
 */
public class ConnectionManager	 {

	private static ResourceBundle dbConfiguration = ResourceBundle.getBundle("traballadores/dao/util/DBConfiguration");

	private static final String DRIVER_CLASS_NAME_PARAMETER = "jdbc.driver.classname";
	private static final String URL_PARAMETER = "jdbc.url";
	private static final String USER_PARAMETER = "jdbc.user";
	private static final String PASSWORD_PARAMETER = "jdbc.password";

	private static String url;
	private static String user;
	private static String password;
	
	private static ComboPooledDataSource dataSource = null;

	static {

		try {

			String driverClassName = dbConfiguration.getString(DRIVER_CLASS_NAME_PARAMETER);
			url = dbConfiguration.getString(URL_PARAMETER);
			user = dbConfiguration.getString(USER_PARAMETER);
			password = dbConfiguration.getString(PASSWORD_PARAMETER);
			

			dataSource = new ComboPooledDataSource();
			dataSource.setDriverClass(driverClassName); //loads the jdbc driver            
			dataSource.setJdbcUrl(url);
			dataSource.setUser(user);                                  
			dataSource.setPassword(password);
			
		} catch (Exception e) {
			
		}

	}

	private ConnectionManager() {
		
	}

	public final static Connection getConnection() throws SQLException {
		
		return dataSource.getConnection();
	}
	
}