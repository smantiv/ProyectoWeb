package com.example.sistema_turnos.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "docente")
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigoInstitucional;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Docente() {}

    public Long getId() {
        return id;
    }

    public String getCodigoInstitucional() {
        return codigoInstitucional;
    }

    public void setCodigoInstitucional(String codigoInstitucional) {
        this.codigoInstitucional = codigoInstitucional;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
