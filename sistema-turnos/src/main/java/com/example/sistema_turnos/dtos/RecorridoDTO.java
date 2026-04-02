package com.example.sistema_turnos.dtos;

import java.time.LocalDateTime;

public class RecorridoDTO {
    
    private Long id;
    private LocalDateTime fechaHora;
    private Long checkpointId;
    private Long asignacionId;

    public RecorridoDTO() {
    }

    public RecorridoDTO(Long id, LocalDateTime fechaHora, Long checkpointId, Long asignacionId) {
        this.id = id;
        this.fechaHora = fechaHora;
        this.checkpointId = checkpointId;
        this.asignacionId = asignacionId;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public Long getCheckpointId() {
        return checkpointId;
    }

    public void setCheckpointId(Long checkpointId) {
        this.checkpointId = checkpointId;
    }

    public Long getAsignacionId() {
        return asignacionId;
    }

    public void setAsignacionId(Long asignacionId) {
        this.asignacionId = asignacionId;
    }
}
