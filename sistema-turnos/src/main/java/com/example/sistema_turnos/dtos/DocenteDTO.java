package com.example.sistema_turnos.dtos;

public class DocenteDTO {
    
    private Long id;
    private String codigoInstitucional;
    private UsuarioDTO usuario;

    public DocenteDTO() {
    }

    public DocenteDTO(Long id, String codigoInstitucional, UsuarioDTO usuario) {
        this.id = id;
        this.codigoInstitucional = codigoInstitucional;
        this.usuario = usuario;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigoInstitucional() {
        return codigoInstitucional;
    }

    public void setCodigoInstitucional(String codigoInstitucional) {
        this.codigoInstitucional = codigoInstitucional;
    }

    public UsuarioDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }
}
