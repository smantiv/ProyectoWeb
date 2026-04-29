package com.example.sistema_turnos.dtos;

public class DocenteActualDTO {

    private Long id;
    private String nombre;
    private String codigoInstitucional;

    public DocenteActualDTO() {
    }

    public DocenteActualDTO(Long id, String nombre, String codigoInstitucional) {
        this.id = id;
        this.nombre = nombre;
        this.codigoInstitucional = codigoInstitucional;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigoInstitucional() {
        return codigoInstitucional;
    }

    public void setCodigoInstitucional(String codigoInstitucional) {
        this.codigoInstitucional = codigoInstitucional;
    }
}
