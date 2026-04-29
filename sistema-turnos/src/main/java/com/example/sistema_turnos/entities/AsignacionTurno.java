package com.example.sistema_turnos.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "asignacion_turno")
public class AsignacionTurno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime horaCheckin;
    private LocalDateTime horaCierre;

    @Min(1)
    @Max(5)
    private Integer calificacionLimpieza;

    private String estadoCobertura;
    private String observacionLimpieza;
    

    @ManyToOne
    @JoinColumn(name = "docente_id")
    private Docente docente;

    @ManyToOne
    @JoinColumn(name = "turno_id")
    private Turno turno;

    public AsignacionTurno() {}

    public Long getId() {
        return id;
    }

    public LocalDateTime getHoraCheckin() {
        return horaCheckin;
    }

    public void setHoraCheckin(LocalDateTime horaCheckin) {
        this.horaCheckin = horaCheckin;
    }

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

    public Docente getDocente() {
        return docente;
    }

    public void setDocente(Docente docente) {
        this.docente = docente;
    }

    public Turno getTurno() {
        return turno;
    }

    public void setTurno(Turno turno) {
        this.turno = turno;
    }

    public String getObservacionLimpieza() {
        return observacionLimpieza;
    }

    public void setObservacionLimpieza(String observacionLimpieza) {
        this.observacionLimpieza = observacionLimpieza;
    }
}
