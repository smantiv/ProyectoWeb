package com.example.sistema_turnos.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidente")
public class Incidente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;
    private String estado;
    private String severidad;
    private String descripcion;
    private LocalDateTime fechaHora;

    @ManyToOne
    @JoinColumn(name = "asignacion_id")
    private AsignacionTurno asignacionTurno;

    public Incidente() {}

    public Long getId() {
        return id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getSeveridad() {
        return severidad;
    }

    public void setSeveridad(String severidad) {
        this.severidad = severidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public AsignacionTurno getAsignacionTurno() {
        return asignacionTurno;
    }

    public void setAsignacionTurno(AsignacionTurno asignacionTurno) {
        this.asignacionTurno = asignacionTurno;
    }
    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}