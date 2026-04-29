package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.TurnoDTO;
import com.example.sistema_turnos.entities.Turno;
import com.example.sistema_turnos.entities.Zona;
import com.example.sistema_turnos.repositories.TurnoRepository;
import com.example.sistema_turnos.repositories.ZonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TurnoService {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private ZonaRepository zonaRepository;

    public TurnoDTO crearTurno(@NonNull TurnoDTO turnoDTO) {
        Turno turno = new Turno();
        turno.setFecha(turnoDTO.getFecha());
        turno.setHoraInicio(turnoDTO.getHoraInicio());
        turno.setHoraFin(turnoDTO.getHoraFin());
        turno.setEstado(turnoDTO.getEstado() != null ? turnoDTO.getEstado() : "disponible");

        Long zonaId = turnoDTO.getZonaId();
        if (zonaId != null) {
            Optional<Zona> zona = zonaRepository.findById(zonaId);
            zona.ifPresent(turno::setZona);
        }

        Turno turnoGuardado = turnoRepository.save(turno);
        return convertToDTO(turnoGuardado);
    }

    public TurnoDTO obtenerTurnoPorId(@NonNull Long id) {
        Optional<Turno> turno = turnoRepository.findById(id);
        return turno.map(this::convertToDTO).orElse(null);
    }

    public List<TurnoDTO> obtenerTodosTurnosPorFecha(@NonNull LocalDate fecha) {
        return turnoRepository.findByFecha(fecha).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TurnoDTO> obtenerTodosTurnosPorEstado(@NonNull String estado) {
        return turnoRepository.findByEstado(estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TurnoDTO> obtenerTodosTurnosPorZona(@NonNull Long zonaId) {
        return turnoRepository.findByZonaId(zonaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TurnoDTO> obtenerTodosTurnosPorFechaYEstado(@NonNull LocalDate fecha, @NonNull String estado) {
        return turnoRepository.findByFechaAndEstado(fecha, estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TurnoDTO> obtenerTodosTurnos() {
        return turnoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TurnoDTO actualizarTurno(@NonNull Long id, @NonNull TurnoDTO turnoDTO) {
        Optional<Turno> turnoExistente = turnoRepository.findById(id);
        if (turnoExistente.isPresent()) {
            Turno turno = turnoExistente.get();
            turno.setFecha(turnoDTO.getFecha());
            turno.setHoraInicio(turnoDTO.getHoraInicio());
            turno.setHoraFin(turnoDTO.getHoraFin());
            turno.setEstado(turnoDTO.getEstado());

            Long zonaId = turnoDTO.getZonaId();
            if (zonaId != null) {
                Optional<Zona> zona = zonaRepository.findById(zonaId);
                zona.ifPresent(turno::setZona);
            }

            Turno turnoActualizado = turnoRepository.save(turno);
            return convertToDTO(turnoActualizado);
        }
        return null;
    }

    public boolean eliminarTurno(@NonNull Long id) {
        if (turnoRepository.existsById(id)) {
            turnoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private TurnoDTO convertToDTO(Turno turno) {
        Long zonaId = turno.getZona() != null ? turno.getZona().getId() : null;
        return new TurnoDTO(
                turno.getId(),
                turno.getFecha(),
                turno.getHoraInicio(),
                turno.getHoraFin(),
                turno.getEstado(),
                zonaId
        );
    }
}
