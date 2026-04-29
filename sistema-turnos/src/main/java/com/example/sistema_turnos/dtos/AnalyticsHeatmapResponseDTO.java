package com.example.sistema_turnos.dtos;

import java.util.List;

public class AnalyticsHeatmapResponseDTO {

    private AnalyticsHeatmapSummaryDTO resumen;
    private List<AnalyticsHeatmapRowDTO> filas;
    private List<AnalyticsOptionDTO> zonas;
    private List<String> tiposIncidente;

    public AnalyticsHeatmapSummaryDTO getResumen() {
        return resumen;
    }

    public void setResumen(AnalyticsHeatmapSummaryDTO resumen) {
        this.resumen = resumen;
    }

    public List<AnalyticsHeatmapRowDTO> getFilas() {
        return filas;
    }

    public void setFilas(List<AnalyticsHeatmapRowDTO> filas) {
        this.filas = filas;
    }

    public List<AnalyticsOptionDTO> getZonas() {
        return zonas;
    }

    public void setZonas(List<AnalyticsOptionDTO> zonas) {
        this.zonas = zonas;
    }

    public List<String> getTiposIncidente() {
        return tiposIncidente;
    }

    public void setTiposIncidente(List<String> tiposIncidente) {
        this.tiposIncidente = tiposIncidente;
    }
}
