package com.example.sistema_turnos.dtos;

import java.time.LocalDateTime;

public class AsignacionTurnoDTO {
    
    private Long id;
    private LocalDateTime horaCheckin;
    private LocalDateTime horaCierre;
    private Integer calificacionLimpieza;
    private String estadoCobertura;
    private Long docenteId;
    private Long turnoId;

    public AsignacionTurnoDTO() {
    }

    public AsignacionTurnoDTO(Long id, LocalDateTime horaCheckin, LocalDateTime horaCierre,
                             Integer calificacionLimpieza, String estadoCobertura, Long docenteId, Long turnoId) {
        this.id = id;
        this.horaCheckin = horaCheckin;
        this.horaCierre = horaCierre;
        this.calificacionLimpieza = calificacionLimpieza;
        this.estadoCobertura = estadoCobertura;
        this.docenteId = docenteId;
        this.turnoId = turnoId;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getHoraCheckin() {
        return horaCheckin;
    }

    public void setHoraCheckin(LocalDateTime horaCheckin) {
        this.horaCheckin = horaCheckin;
    }

    public LocalDateTime getHoraCierre() {
        return horaCierre;
    }

    public void setHoraCierre(LocalDateTime horaCierre) {
        this.horaCierre = horaCierre;
    }

    public Integer getCalificacionLimpieza() {
        return calificacionLimpieza;
    }

    public void setCalificacionLimpieza(Integer calificacionLimpieza) {
        this.calificacionLimpieza = calificacionLimpieza;
    }

    public String getEstadoCobertura() {
        return estadoCobertura;
    }

    public void setEstadoCobertura(String estadoCobertura) {
        this.estadoCobertura = estadoCobertura;
    }

    public Long getDocenteId() {
        return docenteId;
    }

    public void setDocenteId(Long docenteId) {
        this.docenteId = docenteId;
    }

    public Long getTurnoId() {
        return turnoId;
    }

    public void setTurnoId(Long turnoId) {
        this.turnoId = turnoId;
    }
}
