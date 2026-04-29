package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.AsignacionTurnoDTO;
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

    public AsignacionTurnoDTO registrarCheckin(Long id) {
        Optional<AsignacionTurno> asignacionExistente = asignacionTurnoRepository.findById(id);
        if (asignacionExistente.isPresent()) {
            AsignacionTurno asignacion = asignacionExistente.get();

            asignacion.setHoraCheckin(LocalDateTime.now());
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
}
