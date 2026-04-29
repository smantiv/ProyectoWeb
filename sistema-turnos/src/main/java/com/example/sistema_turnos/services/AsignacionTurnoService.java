package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.AsignacionTurnoDTO;
import com.example.sistema_turnos.dtos.CheckinRequestDTO;
import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.entities.Turno;
import com.example.sistema_turnos.repositories.AsignacionTurnoRepository;
import com.example.sistema_turnos.repositories.DocenteRepository;
import com.example.sistema_turnos.repositories.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AsignacionTurnoService {

    @Autowired
    private AsignacionTurnoRepository asignacionTurnoRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private TurnoRepository turnoRepository;

    public AsignacionTurnoDTO crearAsignacionTurno(AsignacionTurnoDTO asignacionTurnoDTO) {
        AsignacionTurno asignacion = new AsignacionTurno();
        asignacion.setHoraCheckin(asignacionTurnoDTO.getHoraCheckin());
        asignacion.setHoraCierre(asignacionTurnoDTO.getHoraCierre());
        asignacion.setCalificacionLimpieza(asignacionTurnoDTO.getCalificacionLimpieza());
        asignacion.setEstadoCobertura(asignacionTurnoDTO.getEstadoCobertura());
        asignacion.setObservacionLimpieza(asignacionTurnoDTO.getObservacionLimpieza()); 

        if (asignacionTurnoDTO.getDocenteId() != null) {
            Optional<Docente> docente = docenteRepository.findById(asignacionTurnoDTO.getDocenteId());
            docente.ifPresent(asignacion::setDocente);
        }

        if (asignacionTurnoDTO.getTurnoId() != null) {
            Optional<Turno> turno = turnoRepository.findById(asignacionTurnoDTO.getTurnoId());
            turno.ifPresent(asignacion::setTurno);
        }

        AsignacionTurno asignacionGuardada = asignacionTurnoRepository.save(asignacion);
        return convertToDTO(asignacionGuardada);
    }

    public AsignacionTurnoDTO obtenerAsignacionPorId(Long id) {
        Optional<AsignacionTurno> asignacion = asignacionTurnoRepository.findById(id);
        return asignacion.map(this::convertToDTO).orElse(null);
    }

    public List<AsignacionTurnoDTO> obtenerAsignacionesPorDocente(Long docenteId) {
        return asignacionTurnoRepository.findByDocenteId(docenteId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AsignacionTurnoDTO> obtenerTodasLasAsignaciones() {
        return asignacionTurnoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AsignacionTurnoDTO actualizarAsignacion(Long id, AsignacionTurnoDTO asignacionTurnoDTO) {
        Optional<AsignacionTurno> asignacionExistente = asignacionTurnoRepository.findById(id);
        if (asignacionExistente.isPresent()) {
            AsignacionTurno asignacion = asignacionExistente.get();
            asignacion.setHoraCheckin(asignacionTurnoDTO.getHoraCheckin());
            asignacion.setHoraCierre(asignacionTurnoDTO.getHoraCierre());
            asignacion.setCalificacionLimpieza(asignacionTurnoDTO.getCalificacionLimpieza());
            asignacion.setEstadoCobertura(asignacionTurnoDTO.getEstadoCobertura());

            if (asignacionTurnoDTO.getDocenteId() != null) {
                Optional<Docente> docente = docenteRepository.findById(asignacionTurnoDTO.getDocenteId());
                docente.ifPresent(asignacion::setDocente);
            }

            if (asignacionTurnoDTO.getTurnoId() != null) {
                Optional<Turno> turno = turnoRepository.findById(asignacionTurnoDTO.getTurnoId());
                turno.ifPresent(asignacion::setTurno);
            }

            AsignacionTurno asignacionActualizada = asignacionTurnoRepository.save(asignacion);
            return convertToDTO(asignacionActualizada);
        }
        return null;
    }

    public AsignacionTurnoDTO registrarCheckin(Long id, CheckinRequestDTO checkinRequestDTO) {
        if (checkinRequestDTO == null) {
            throw new IllegalArgumentException("Debes enviar los datos del check-in.");
        }

        if (checkinRequestDTO.getCheckpointId() == null) {
            throw new IllegalArgumentException("El checkpointId es obligatorio.");
        }

        String pinIngresado = checkinRequestDTO.getPin() != null ? checkinRequestDTO.getPin().trim() : "";
        if (pinIngresado.isEmpty()) {
            throw new IllegalArgumentException("El PIN es obligatorio.");
        }

        Optional<AsignacionTurno> asignacionExistente = asignacionTurnoRepository.findById(id);
        if (asignacionExistente.isPresent()) {
            AsignacionTurno asignacion = asignacionExistente.get();
            Turno turno = asignacion.getTurno();

            if (turno == null) {
                throw new IllegalStateException("La asignacion no tiene un turno asociado.");
            }

            if (asignacion.getHoraCheckin() != null) {
                throw new IllegalStateException("La asignacion ya tiene un check-in registrado.");
            }

            if (turno.getFecha() == null || turno.getHoraInicio() == null || turno.getHoraFin() == null) {
                throw new IllegalStateException("El turno no tiene una ventana horaria valida.");
            }

            LocalDateTime ahora = LocalDateTime.now();
            LocalDateTime inicioTurno = LocalDateTime.of(turno.getFecha(), turno.getHoraInicio());
            LocalDateTime finTurno = LocalDateTime.of(turno.getFecha(), turno.getHoraFin());

            if (ahora.isBefore(inicioTurno)) {
                throw new IllegalStateException("El turno aun no ha iniciado.");
            }

            if (!ahora.isBefore(finTurno)) {
                throw new IllegalStateException("El turno ya finalizo. No se puede registrar check-in.");
            }

            String pinEsperado = generarPinDinamico(checkinRequestDTO.getCheckpointId(), obtenerVentanaActual());
            if (!pinEsperado.equals(pinIngresado)) {
                throw new IllegalArgumentException("PIN invalido para el checkpoint enviado.");
            }

            asignacion.setHoraCheckin(ahora);
            asignacion.setEstadoCobertura("cubierta");

            AsignacionTurno asignacionActualizada = asignacionTurnoRepository.save(asignacion);
            return convertToDTO(asignacionActualizada);
        }
        return null;
    }

    public boolean eliminarAsignacion(Long id) {
        if (asignacionTurnoRepository.existsById(id)) {
            asignacionTurnoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private AsignacionTurnoDTO convertToDTO(AsignacionTurno asignacion) {
        Long docenteId = asignacion.getDocente() != null ? asignacion.getDocente().getId() : null;
        Long turnoId = asignacion.getTurno() != null ? asignacion.getTurno().getId() : null;
        return new AsignacionTurnoDTO(
                asignacion.getId(),
                asignacion.getHoraCheckin(),
                asignacion.getHoraCierre(),
                asignacion.getCalificacionLimpieza(),
                asignacion.getEstadoCobertura(),
                turnoId,
                docenteId,
                asignacion.getObservacionLimpieza()
        );
    }

    private long obtenerVentanaActual() {
        return System.currentTimeMillis() / 30000;
    }

    private String generarPinDinamico(Long checkpointId, long windowSlot) {
        long seed = (checkpointId * 7919L) + (windowSlot * 104729L);
        return String.valueOf(Math.abs(seed % 9000) + 1000).substring(0, 4);
    }
}
