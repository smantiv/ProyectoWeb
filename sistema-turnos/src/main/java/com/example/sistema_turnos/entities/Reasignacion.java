package com.example.sistema_turnos.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reasignacion")
public class Reasignacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String motivo;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaRespuesta;
    private String estado;

    @ManyToOne
    @JoinColumn(name = "docente_id")
    private Docente docente;

    @ManyToOne
    @JoinColumn(name = "docente_reemplazo_id")
    private Docente docenteReemplazo;

    @ManyToOne
    @JoinColumn(name = "turno_id")
    private Turno turno;
    private String aprobador; 

    public Reasignacion() {}

    public Long getId() { return id; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public LocalDateTime getFechaRespuesta() { return fechaRespuesta; }
    public void setFechaRespuesta(LocalDateTime fechaRespuesta) { this.fechaRespuesta = fechaRespuesta; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Docente getDocente() { return docente; }
    public void setDocente(Docente docente) { this.docente = docente; }

    public Docente getDocenteReemplazo() { return docenteReemplazo; }
    public void setDocenteReemplazo(Docente docenteReemplazo) { this.docenteReemplazo = docenteReemplazo; }

    public Turno getTurno() { return turno; }
    public void setTurno(Turno turno) { this.turno = turno; }

    public String getAprobador() { return aprobador; }
    public void setAprobador(String aprobador) { this.aprobador = aprobador; }
}