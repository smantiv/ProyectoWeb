package com.example.sistema_turnos.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AsignacionTurnoDetalleDTO {

    private Long asignacionId;
    private Long turnoId;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String zona;
    private String estado;
    private LocalDateTime horaCheckin;

    public Long getAsignacionId() {
        return asignacionId;
    }

    public void setAsignacionId(Long asignacionId) {
        this.asignacionId = asignacionId;
    }

    public Long getTurnoId() {
        return turnoId;
    }

    public void setTurnoId(Long turnoId) {
        this.turnoId = turnoId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public String getZona() {
        return zona;
    }

    public void setZona(String zona) {
        this.zona = zona;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getHoraCheckin() {
        return horaCheckin;
    }

    public void setHoraCheckin(LocalDateTime horaCheckin) {
        this.horaCheckin = horaCheckin;
    }
}
