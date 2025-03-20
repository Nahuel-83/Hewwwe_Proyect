package traballadores.model;

public class Departamento {
	private int numero;
	private String nome = null;
	private int director;
	private char tipodirector;
	private float presuposto;
	private int depende;
	private int centro;
	private int empregados;
	
	public Departamento() {}

	public int getNumero() {
		return numero;
	}

	public void setNumero(int numero) {
		this.numero = numero;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public int getDirector() {
		return director;
	}

	public void setDirector(int director) {
		this.director = director;
	}

	public char getTipodirector() {
		return tipodirector;
	}

	public void setTipodirector(char tipodirector) {
		this.tipodirector = tipodirector;
	}

	public float getPresuposto() {
		return presuposto;
	}

	public void setPresuposto(float presuposto) {
		this.presuposto = presuposto;
	}

	public int getDepende() {
		return depende;
	}

	public void setDepende(int depende) {
		this.depende = depende;
	}

	public int getCentro() {
		return centro;
	}

	public void setCentro(int centro) {
		this.centro = centro;
	}

	public int getEmpregados() {
		return empregados;
	}

	public void setEmpregados(int empregados) {
		this.empregados = empregados;
	}

	
}
