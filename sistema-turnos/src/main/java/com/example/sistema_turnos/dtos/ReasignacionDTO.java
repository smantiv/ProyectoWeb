package com.example.sistema_turnos.dtos;

import java.time.LocalDateTime;

public class ReasignacionDTO {
    
    private Long id;
    private String motivo;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaRespuesta;
    private String estado;
    private Long docenteId;

    public ReasignacionDTO() {
    }

    public ReasignacionDTO(Long id, String motivo, LocalDateTime fechaSolicitud, LocalDateTime fechaRespuesta, String estado, Long docenteId) {
        this.id = id;
        this.motivo = motivo;
        this.fechaSolicitud = fechaSolicitud;
        this.fechaRespuesta = fechaRespuesta;
        this.estado = estado;
        this.docenteId = docenteId;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public LocalDateTime getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDateTime fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public LocalDateTime getFechaRespuesta() {
        return fechaRespuesta;
    }

    public void setFechaRespuesta(LocalDateTime fechaRespuesta) {
        this.fechaRespuesta = fechaRespuesta;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Long getDocenteId() {
        return docenteId;
    }

    public void setDocenteId(Long docenteId) {
        this.docenteId = docenteId;
    }
}
