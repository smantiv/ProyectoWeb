package com.example.sistema_turnos.dtos;

public class AnalyticsHeatmapSummaryDTO {

    private long totalIncidentes;
    private long zonasConIncidentes;
    private String zonaTop;
    private long tiposVisibles;

    public long getTotalIncidentes() {
        return totalIncidentes;
    }

    public void setTotalIncidentes(long totalIncidentes) {
        this.totalIncidentes = totalIncidentes;
    }

    public long getZonasConIncidentes() {
        return zonasConIncidentes;
    }

    public void setZonasConIncidentes(long zonasConIncidentes) {
        this.zonasConIncidentes = zonasConIncidentes;
    }

    public String getZonaTop() {
        return zonaTop;
    }

    public void setZonaTop(String zonaTop) {
        this.zonaTop = zonaTop;
    }

    public long getTiposVisibles() {
        return tiposVisibles;
    }

    public void setTiposVisibles(long tiposVisibles) {
        this.tiposVisibles = tiposVisibles;
    }
}
