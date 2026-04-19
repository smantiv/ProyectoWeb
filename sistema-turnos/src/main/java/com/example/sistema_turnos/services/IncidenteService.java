package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.IncidenteDTO;
import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Incidente;
import com.example.sistema_turnos.repositories.AsignacionTurnoRepository;
import com.example.sistema_turnos.repositories.IncidenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IncidenteService {

    @Autowired
    private IncidenteRepository incidenteRepository;

    @Autowired
    private AsignacionTurnoRepository asignacionTurnoRepository;

    public IncidenteDTO crearIncidente(IncidenteDTO incidenteDTO) {
        Incidente incidente = new Incidente();
        incidente.setTipo(incidenteDTO.getTipo());
        incidente.setSeveridad(incidenteDTO.getSeveridad());
        incidente.setDescripcion(incidenteDTO.getDescripcion());
        incidente.setFechaHora(incidenteDTO.getFechaHora());
        incidente.setEstado(incidenteDTO.getEstado());
        

        if (incidenteDTO.getAsignacionId() != null) {
            Optional<AsignacionTurno> asignacion = asignacionTurnoRepository.findById(incidenteDTO.getAsignacionId());
            asignacion.ifPresent(incidente::setAsignacionTurno);
        }

        Incidente incidenteGuardado = incidenteRepository.save(incidente);
        return convertToDTO(incidenteGuardado);
    }

    public IncidenteDTO obtenerIncidentePorId(Long id) {
        Optional<Incidente> incidente = incidenteRepository.findById(id);
        return incidente.map(this::convertToDTO).orElse(null);
    }

    public List<IncidenteDTO> obtenerIncidentesPorAsignacion(Long asignacionId) {
        return incidenteRepository.findByAsignacionTurnoId(asignacionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<IncidenteDTO> obtenerIncidentesPorTipo(String tipo) {
        return incidenteRepository.findByTipo(tipo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<IncidenteDTO> obtenerTodosLosIncidentes() {
        return incidenteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public IncidenteDTO actualizarIncidente(Long id, IncidenteDTO incidenteDTO) {
        Optional<Incidente> incidenteExistente = incidenteRepository.findById(id);
        if (incidenteExistente.isPresent()) {
            Incidente incidente = incidenteExistente.get();
            incidente.setTipo(incidenteDTO.getTipo());
            incidente.setSeveridad(incidenteDTO.getSeveridad());
            incidente.setDescripcion(incidenteDTO.getDescripcion());
            incidente.setFechaHora(incidenteDTO.getFechaHora());
            incidente.setEstado(incidenteDTO.getEstado());

            if (incidenteDTO.getAsignacionId() != null) {
                Optional<AsignacionTurno> asignacion = asignacionTurnoRepository.findById(incidenteDTO.getAsignacionId());
                asignacion.ifPresent(incidente::setAsignacionTurno);
            }

            Incidente incidenteActualizado = incidenteRepository.save(incidente);
            return convertToDTO(incidenteActualizado);
        }
        return null;
    }
    public List<IncidenteDTO> obtenerIncidentesPorSeveridad(String severidad) {
    return incidenteRepository.findBySeveridad(severidad).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

public List<IncidenteDTO> obtenerIncidentesPorEstado(String estado) {
    return incidenteRepository.findByEstado(estado).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

    public boolean eliminarIncidente(Long id) {
        if (incidenteRepository.existsById(id)) {
            incidenteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private IncidenteDTO convertToDTO(Incidente incidente) {
    Long asignacionId = incidente.getAsignacionTurno() != null
            ? incidente.getAsignacionTurno().getId()
            : null;

    String ubicacion = null;

    if (incidente.getAsignacionTurno() != null
            && incidente.getAsignacionTurno().getTurno() != null
            && incidente.getAsignacionTurno().getTurno().getZona() != null) {
        ubicacion = incidente.getAsignacionTurno().getTurno().getZona().getNombre();
    }

    IncidenteDTO dto = new IncidenteDTO();
    dto.setId(incidente.getId());
    dto.setTipo(incidente.getTipo());
    dto.setSeveridad(incidente.getSeveridad());
    dto.setDescripcion(incidente.getDescripcion());
    dto.setFechaHora(incidente.getFechaHora());
    dto.setEstado(incidente.getEstado());
    dto.setAsignacionId(asignacionId);
    dto.setUbicacion(ubicacion);

    return dto;
}
}
