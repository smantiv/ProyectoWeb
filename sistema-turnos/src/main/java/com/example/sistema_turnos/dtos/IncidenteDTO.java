package com.example.sistema_turnos.dtos;

import java.time.LocalDateTime;

public class IncidenteDTO {
    
    private Long id;
    private String tipo;
    private String severidad;
    private String descripcion;
    private LocalDateTime fechaHora;
    private Long asignacionId;

    public IncidenteDTO() {
    }

    public IncidenteDTO(Long id, String tipo, String severidad, String descripcion, LocalDateTime fechaHora, Long asignacionId) {
        this.id = id;
        this.tipo = tipo;
        this.severidad = severidad;
        this.descripcion = descripcion;
        this.fechaHora = fechaHora;
        this.asignacionId = asignacionId;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getAsignacionId() {
        return asignacionId;
    }

    public void setAsignacionId(Long asignacionId) {
        this.asignacionId = asignacionId;
    }
}
