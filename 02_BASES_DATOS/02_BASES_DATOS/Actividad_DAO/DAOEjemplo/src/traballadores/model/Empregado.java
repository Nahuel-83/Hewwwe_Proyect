package traballadores.model;

import java.util.Date;

public class Empregado {
	private int numero;
	private String nome;
	private int departamento;
	private int extension;
	private Date datanacemento;
	private Date dataingreso;
	private float salario;
	private float comision;
	private int fillos;

	public Empregado(){
		
	}

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

	public int getDepartamento() {
		return departamento;
	}

	public void setDepartamento(int departamento) {
		this.departamento = departamento;
	}

	public int getExtension() {
		return extension;
	}

	public void setExtension(int extension) {
		this.extension = extension;
	}

	public Date getDatanacemento() {
		return datanacemento;
	}

	public void setDatanacemento(Date datanacemento) {
		this.datanacemento = datanacemento;
	}

	public Date getDataingreso() {
		return dataingreso;
	}

	public void setDataingreso(Date dataingreso) {
		this.dataingreso = dataingreso;
	}

	public float getSalario() {
		return salario;
	}

	public void setSalario(float salario) {
		this.salario = salario;
	}

	public float getComision() {
		return comision;
	}

	public void setComision(float comision) {
		this.comision = comision;
	}

	public int getFillos() {
		return fillos;
	}

	public void setFillos(int fillos) {
		this.fillos = fillos;
	}
	
	
	
}
