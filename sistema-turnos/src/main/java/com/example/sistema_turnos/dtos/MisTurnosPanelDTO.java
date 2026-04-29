package com.example.sistema_turnos.dtos;

import java.util.List;

public class MisTurnosPanelDTO {

    private MisTurnosResumenDTO resumen;
    private List<MisTurnosDiaDTO> vistaSemanal;
    private List<AsignacionTurnoDetalleDTO> turnos;

    public MisTurnosResumenDTO getResumen() {
        return resumen;
    }

    public void setResumen(MisTurnosResumenDTO resumen) {
        this.resumen = resumen;
    }

    public List<MisTurnosDiaDTO> getVistaSemanal() {
        return vistaSemanal;
    }

    public void setVistaSemanal(List<MisTurnosDiaDTO> vistaSemanal) {
        this.vistaSemanal = vistaSemanal;
    }

    public List<AsignacionTurnoDetalleDTO> getTurnos() {
        return turnos;
    }

    public void setTurnos(List<AsignacionTurnoDetalleDTO> turnos) {
        this.turnos = turnos;
    }
}
