package com.example.sistema_turnos.dtos;

import java.time.LocalDate;

public class MisTurnosDiaDTO {

    private LocalDate fecha;
    private String etiqueta;
    private long cantidadTurnos;

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getEtiqueta() {
        return etiqueta;
    }

    public void setEtiqueta(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public long getCantidadTurnos() {
        return cantidadTurnos;
    }

    public void setCantidadTurnos(long cantidadTurnos) {
        this.cantidadTurnos = cantidadTurnos;
    }
}
