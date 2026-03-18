package com.example.sistema_turnos.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recorrido")
public class Recorrido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fechaHora;

    @ManyToOne
    @JoinColumn(name = "checkpoint_id")
    private Checkpoint checkpoint;

    @ManyToOne
    @JoinColumn(name = "asignacion_id")
    private AsignacionTurno asignacionTurno;

    public Recorrido() {}

    public Long getId() {
        return id;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public Checkpoint getCheckpoint() {
        return checkpoint;
    }

    public void setCheckpoint(Checkpoint checkpoint) {
        this.checkpoint = checkpoint;
    }

    public AsignacionTurno getAsignacionTurno() {
        return asignacionTurno;
    }

    public void setAsignacionTurno(AsignacionTurno asignacionTurno) {
        this.asignacionTurno = asignacionTurno;
    }
}