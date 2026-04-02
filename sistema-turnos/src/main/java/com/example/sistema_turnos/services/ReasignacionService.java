package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.ReasignacionDTO;
import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.entities.Reasignacion;
import com.example.sistema_turnos.repositories.DocenteRepository;
import com.example.sistema_turnos.repositories.ReasignacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReasignacionService {

    @Autowired
    private ReasignacionRepository reasignacionRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    public ReasignacionDTO crearReasignacion(ReasignacionDTO reasignacionDTO) {
        Reasignacion reasignacion = new Reasignacion();
        reasignacion.setMotivo(reasignacionDTO.getMotivo());
        reasignacion.setFechaSolicitud(reasignacionDTO.getFechaSolicitud());
        reasignacion.setFechaRespuesta(reasignacionDTO.getFechaRespuesta());
        reasignacion.setEstado(reasignacionDTO.getEstado() != null ? reasignacionDTO.getEstado() : "pendiente");

        if (reasignacionDTO.getDocenteId() != null) {
            Optional<Docente> docente = docenteRepository.findById(reasignacionDTO.getDocenteId());
            docente.ifPresent(reasignacion::setDocente);
        }

        Reasignacion reasignacionGuardada = reasignacionRepository.save(reasignacion);
        return convertToDTO(reasignacionGuardada);
    }

    public ReasignacionDTO obtenerReasignacionPorId(Long id) {
        Optional<Reasignacion> reasignacion = reasignacionRepository.findById(id);
        return reasignacion.map(this::convertToDTO).orElse(null);
    }

    public List<ReasignacionDTO> obtenerReasignacionesPorDocente(Long docenteId) {
        return reasignacionRepository.findByDocenteId(docenteId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReasignacionDTO> obtenerReasignacionesPorEstado(String estado) {
        return reasignacionRepository.findByEstado(estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReasignacionDTO> obtenerReasignacionesPorDocenteYEstado(Long docenteId, String estado) {
        return reasignacionRepository.findByDocenteIdAndEstado(docenteId, estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReasignacionDTO> obtenerTodasLasReasignaciones() {
        return reasignacionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ReasignacionDTO actualizarReasignacion(Long id, ReasignacionDTO reasignacionDTO) {
        Optional<Reasignacion> reasignacionExistente = reasignacionRepository.findById(id);
        if (reasignacionExistente.isPresent()) {
            Reasignacion reasignacion = reasignacionExistente.get();
            reasignacion.setMotivo(reasignacionDTO.getMotivo());
            reasignacion.setFechaSolicitud(reasignacionDTO.getFechaSolicitud());
            reasignacion.setFechaRespuesta(reasignacionDTO.getFechaRespuesta());
            reasignacion.setEstado(reasignacionDTO.getEstado());

            if (reasignacionDTO.getDocenteId() != null) {
                Optional<Docente> docente = docenteRepository.findById(reasignacionDTO.getDocenteId());
                docente.ifPresent(reasignacion::setDocente);
            }

            Reasignacion reasignacionActualizada = reasignacionRepository.save(reasignacion);
            return convertToDTO(reasignacionActualizada);
        }
        return null;
    }

    public boolean eliminarReasignacion(Long id) {
        if (reasignacionRepository.existsById(id)) {
            reasignacionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private ReasignacionDTO convertToDTO(Reasignacion reasignacion) {
        Long docenteId = reasignacion.getDocente() != null ? reasignacion.getDocente().getId() : null;
        return new ReasignacionDTO(
                reasignacion.getId(),
                reasignacion.getMotivo(),
                reasignacion.getFechaSolicitud(),
                reasignacion.getFechaRespuesta(),
                reasignacion.getEstado(),
                docenteId
        );
    }
}
