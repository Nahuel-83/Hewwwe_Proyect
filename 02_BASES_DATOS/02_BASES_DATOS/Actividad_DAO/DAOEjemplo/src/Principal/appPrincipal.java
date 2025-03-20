package Principal;

import traballadores.service.*;
import traballadores.service.impl.*;
import traballadores.model.*;
import traballadores.dao.util.ConnectionManager;

import java.util.ArrayList;
import java.util.List;

/* Clase principal que simula (como si fuera una capa de aplicaci�n), 
 * las llamadas que har�a a una capa de negocio para solicitar una tarea
 */

public class appPrincipal {
	
	
	
	public static void main(String[] args) {
		//operaci�n de listado de centros
		//listarCentros();
		
		//operaci�n de insertar centro
		insertarCentro();
		

	}

	// M�todo que simula una llamada a para mostrar todo el contenido de la tabla centros.
	public static void listarCentros() {
		//Lista de centros donde se guardar�n los resultados. Cada objeto centro de la lista
		//ser� una tupla que recuperamos de la base de datos (de la tabla centros)
		List<Centro> resultados = new ArrayList<Centro>();
		
		Centro centro = new Centro();
		
		System.out.println("Instanciamos el Servicio de Centros");
		CentroService centroservice = new CentroServiceImpl();
		
		//Aqu� cogemos el primer centro de la lista y lo mostramos
		//Esto estar�a incompleto, ya que tendriamos que recorres toda la lista para mostrar el resultado
		try {
			resultados = centroservice.findAll();
			System.out.println("El numero de centros es"+ resultados.size());
			centro = resultados.get(0);
			System.out.print(centro.getNumero()+" | ");
			System.out.print(centro.getNome()+" | ");
			System.out.print(centro.getEnderezo() );

		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		
	}
	
	//M�todo que simula la inserci�n de un centro.
	public static void insertarCentro (){
		//Instanciamos un objeto centro del modelo
		Centro centro =new Centro();
		//Instanciamos el objeto que implementa los servicios sobre centro
		CentroService centroservice = new CentroServiceImpl();
		
		//Asignamos los valores al centro a insertar
		centro.setNumero(50);
		centro.setNome("O mellor centro");
		centro.setEnderezo("Nosa sra Da Sainza ");
		//Llamamos al servicio que har� la inserci�n. Eso si, llamara a la capa de accedo a datos (DAO=
		//para que sea desde esta capa desde donde se haga la inserci�n
		try{
			int filasInsertadas =centroservice.addCentro(centro);
		}catch(Exception e) {
			System.out.println(e.getMessage());
		}
		
	}

}
