package com.example.sistema_turnos.dtos;

public class CheckpointDTO {
    
    private Long id;
    private String nombre;

    public CheckpointDTO() {
    }

    public CheckpointDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
