package com.example.sistema_turnos.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CierreTurnoDTO {

    @NotNull(message = "La hora de cierre es obligatoria")
    private LocalDateTime horaCierre;

    @NotNull(message = "La calificacion de limpieza es obligatoria")
    @Min(value = 1, message = "La calificacion de limpieza debe estar entre 1 y 5")
    @Max(value = 5, message = "La calificacion de limpieza debe estar entre 1 y 5")
    private Integer calificacionLimpieza;

    @NotNull(message = "El estado de cobertura es obligatorio")
    private String estadoCobertura;

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
}
