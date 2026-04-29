package com.example.sistema_turnos.dtos;

public class MisTurnosResumenDTO {

    private long totalTurnosSemana;
    private long turnosCompletados;
    private String proximoTurno;

    public long getTotalTurnosSemana() {
        return totalTurnosSemana;
    }

    public void setTotalTurnosSemana(long totalTurnosSemana) {
        this.totalTurnosSemana = totalTurnosSemana;
    }

    public long getTurnosCompletados() {
        return turnosCompletados;
    }

    public void setTurnosCompletados(long turnosCompletados) {
        this.turnosCompletados = turnosCompletados;
    }

    public String getProximoTurno() {
        return proximoTurno;
    }

    public void setProximoTurno(String proximoTurno) {
        this.proximoTurno = proximoTurno;
    }
}
