package com.example.sistema_turnos.dtos;

public class AnalyticsHeatmapRowDTO {

    private Long zonaId;
    private String zona;
    private String tipo;
    private long cantidadIncidentes;
    private double porcentajeTotal;
    private long incidentesManana;
    private long incidentesTarde;
    private double porcentajeCobertura;

    public Long getZonaId() {
        return zonaId;
    }

    public void setZonaId(Long zonaId) {
        this.zonaId = zonaId;
    }

    public String getZona() {
        return zona;
    }

    public void setZona(String zona) {
        this.zona = zona;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public long getCantidadIncidentes() {
        return cantidadIncidentes;
    }

    public void setCantidadIncidentes(long cantidadIncidentes) {
        this.cantidadIncidentes = cantidadIncidentes;
    }

    public double getPorcentajeTotal() {
        return porcentajeTotal;
    }

    public void setPorcentajeTotal(double porcentajeTotal) {
        this.porcentajeTotal = porcentajeTotal;
    }

    public long getIncidentesManana() {
        return incidentesManana;
    }

    public void setIncidentesManana(long incidentesManana) {
        this.incidentesManana = incidentesManana;
    }

    public long getIncidentesTarde() {
        return incidentesTarde;
    }

    public void setIncidentesTarde(long incidentesTarde) {
        this.incidentesTarde = incidentesTarde;
    }

    public double getPorcentajeCobertura() {
        return porcentajeCobertura;
    }

    public void setPorcentajeCobertura(double porcentajeCobertura) {
        this.porcentajeCobertura = porcentajeCobertura;
    }
}
