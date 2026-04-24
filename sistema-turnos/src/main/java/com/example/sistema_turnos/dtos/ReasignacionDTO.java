package com.example.sistema_turnos.dtos;

import java.time.LocalDateTime;

public class ReasignacionDTO {

    private Long id;
    private String motivo;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaRespuesta;
    private String estado;
    private Long docenteId;
    private String docenteNombre;
    private Long docenteReemplazoId;
    private String docenteReemplazoNombre;
    private Long turnoId;
    private String turnoDescripcion;

    public ReasignacionDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public LocalDateTime getFechaRespuesta() { return fechaRespuesta; }
    public void setFechaRespuesta(LocalDateTime fechaRespuesta) { this.fechaRespuesta = fechaRespuesta; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Long getDocenteId() { return docenteId; }
    public void setDocenteId(Long docenteId) { this.docenteId = docenteId; }

    public String getDocenteNombre() { return docenteNombre; }
    public void setDocenteNombre(String docenteNombre) { this.docenteNombre = docenteNombre; }

    public Long getDocenteReemplazoId() { return docenteReemplazoId; }
    public void setDocenteReemplazoId(Long docenteReemplazoId) { this.docenteReemplazoId = docenteReemplazoId; }

    public String getDocenteReemplazoNombre() { return docenteReemplazoNombre; }
    public void setDocenteReemplazoNombre(String docenteReemplazoNombre) { this.docenteReemplazoNombre = docenteReemplazoNombre; }

    public Long getTurnoId() { return turnoId; }
    public void setTurnoId(Long turnoId) { this.turnoId = turnoId; }

    public String getTurnoDescripcion() { return turnoDescripcion; }
    public void setTurnoDescripcion(String turnoDescripcion) { this.turnoDescripcion = turnoDescripcion; }
}