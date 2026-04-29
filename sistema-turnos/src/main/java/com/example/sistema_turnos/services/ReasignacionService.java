package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.DocenteDTO;
import com.example.sistema_turnos.dtos.ReasignacionDTO;
import com.example.sistema_turnos.dtos.UsuarioDTO;
import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.entities.Reasignacion;
import com.example.sistema_turnos.entities.Turno;
import com.example.sistema_turnos.repositories.AsignacionTurnoRepository;
import com.example.sistema_turnos.repositories.DocenteRepository;
import com.example.sistema_turnos.repositories.ReasignacionRepository;
import com.example.sistema_turnos.repositories.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReasignacionService {

    @Autowired
    private ReasignacionRepository reasignacionRepository;

    @Autowired 
    private DocenteRepository docenteRepository;
    
    @Autowired 
    private TurnoRepository turnoRepository;
    
    @Autowired 
    private AsignacionTurnoRepository asignacionTurnoRepository;

    // Crear solicitud de reasignación
    public ReasignacionDTO crearReasignacion(ReasignacionDTO dto) {
        Reasignacion r = new Reasignacion();
        r.setMotivo(dto.getMotivo());
        r.setFechaSolicitud(LocalDateTime.now());
        r.setEstado("pendiente");

        if (dto.getDocenteId() != null) {
            docenteRepository.findById(dto.getDocenteId()).ifPresent(r::setDocente);
        }
        if (dto.getTurnoId() != null) {
            turnoRepository.findById(dto.getTurnoId()).ifPresent(r::setTurno);
        }

        return convertToDTO(reasignacionRepository.save(r));
    }

    // Candidatos disponibles para cubrir un turno
    public List<DocenteDTO> obtenerCandidatos(Long turnoId) {
        // Obtener el turno que necesita cobertura
        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));

        LocalDate fechaTurno = turno.getFecha();
        LocalTime inicioTurno = turno.getHoraInicio();
        LocalTime finTurno = turno.getHoraFin();

        // Obtener todos los turnos que se solapan en fecha y horario
        List<Long> docentesOcupados = asignacionTurnoRepository.findAll().stream()
                .filter(a -> {
                    Turno t = a.getTurno();
                    if (t == null || a.getDocente() == null) return false;
                    // Mismo día
                    if (!t.getFecha().equals(fechaTurno)) return false;
                    // Se solapan si no termina antes de que empiece ni empieza después de que termine
                    return t.getHoraInicio().isBefore(finTurno) && t.getHoraFin().isAfter(inicioTurno);
                })
                .map(a -> a.getDocente().getId())
                .distinct()
                .collect(Collectors.toList());

        // Docentes con solicitud pendiente en ese mismo turno
        List<Long> enProceso = reasignacionRepository.findByTurnoIdAndEstado(turnoId, "pendiente")
                .stream().map(r -> r.getDocente().getId()).collect(Collectors.toList());

        return docenteRepository.findAll().stream()
                .filter(d -> !docentesOcupados.contains(d.getId()) && !enProceso.contains(d.getId()))
                .map(this::convertDocenteToDTO)
                .limit(5)
                .collect(Collectors.toList());
    }

    // Aceptar o rechazar una reasignación
    public ReasignacionDTO responder(Long id, Long docenteReemplazoId, String decision) {
        Optional<Reasignacion> opt = reasignacionRepository.findById(id);
        if (opt.isEmpty()) return null;

        Reasignacion r = opt.get();
        r.setEstado(decision);
        r.setFechaRespuesta(LocalDateTime.now());

        if ("aceptada".equals(decision) && docenteReemplazoId != null) {
            Docente reemplazo = docenteRepository.findById(docenteReemplazoId)
                    .orElseThrow(() -> new RuntimeException("Docente reemplazo no encontrado"));
            r.setDocenteReemplazo(reemplazo);

            // Actualizar la AsignacionTurno real del turno
            if (r.getTurno() != null) {
                List<AsignacionTurno> asignaciones = asignacionTurnoRepository.findByTurnoId(r.getTurno().getId());
                if (!asignaciones.isEmpty()) {
                    // Actualizar la asignación existente con el nuevo docente
                    AsignacionTurno asignacion = asignaciones.get(0);
                    asignacion.setDocente(reemplazo);
                    asignacion.setEstadoCobertura("reasignada");
                    asignacionTurnoRepository.save(asignacion);
                } else {
                    // Si no existe asignación, crear una nueva
                    AsignacionTurno nueva = new AsignacionTurno();
                    nueva.setDocente(reemplazo);
                    nueva.setTurno(r.getTurno());
                    nueva.setEstadoCobertura("reasignada");
                    asignacionTurnoRepository.save(nueva);
                }
            }
        }

        return convertToDTO(reasignacionRepository.save(r));
    }

    // CRUD estándar
    public List<ReasignacionDTO> obtenerTodasLasReasignaciones() {
        return reasignacionRepository.findAll().stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    public ReasignacionDTO obtenerReasignacionPorId(Long id) {
        return reasignacionRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    public List<ReasignacionDTO> obtenerReasignacionesPorDocente(Long docenteId) {
        return reasignacionRepository.findByDocenteId(docenteId).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<ReasignacionDTO> obtenerReasignacionesPorEstado(String estado) {
        return reasignacionRepository.findByEstado(estado).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<ReasignacionDTO> obtenerReasignacionesPorDocenteYEstado(Long docenteId, String estado) {
        return reasignacionRepository.findByDocenteIdAndEstado(docenteId, estado).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    public ReasignacionDTO actualizarReasignacion(Long id, ReasignacionDTO dto) {
        Optional<Reasignacion> opt = reasignacionRepository.findById(id);
        if (opt.isEmpty()) return null;

        Reasignacion r = opt.get();
        r.setMotivo(dto.getMotivo());
        r.setFechaSolicitud(dto.getFechaSolicitud());
        r.setFechaRespuesta(dto.getFechaRespuesta());
        r.setEstado(dto.getEstado());

        if (dto.getDocenteId() != null) {
            docenteRepository.findById(dto.getDocenteId()).ifPresent(r::setDocente);
        }
        if (dto.getTurnoId() != null) {
            turnoRepository.findById(dto.getTurnoId()).ifPresent(r::setTurno);
        }
        if (dto.getDocenteReemplazoId() != null) {
            docenteRepository.findById(dto.getDocenteReemplazoId()).ifPresent(r::setDocenteReemplazo);
        }

        return convertToDTO(reasignacionRepository.save(r));
    }

    public boolean eliminarReasignacion(Long id) {
        if (reasignacionRepository.existsById(id)) {
            reasignacionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Conversores
    private ReasignacionDTO convertToDTO(Reasignacion r) {
        ReasignacionDTO dto = new ReasignacionDTO();
        dto.setId(r.getId());
        dto.setMotivo(r.getMotivo());
        dto.setFechaSolicitud(r.getFechaSolicitud());
        dto.setFechaRespuesta(r.getFechaRespuesta());
        dto.setEstado(r.getEstado());

        if (r.getDocente() != null) {
            dto.setDocenteId(r.getDocente().getId());
            if (r.getDocente().getUsuario() != null)
                dto.setDocenteNombre(r.getDocente().getUsuario().getNombre());
        }
        if (r.getDocenteReemplazo() != null) {
            dto.setDocenteReemplazoId(r.getDocenteReemplazo().getId());
            if (r.getDocenteReemplazo().getUsuario() != null)
                dto.setDocenteReemplazoNombre(r.getDocenteReemplazo().getUsuario().getNombre());
        }
        if (r.getTurno() != null) {
            dto.setTurnoId(r.getTurno().getId());
            String zona = r.getTurno().getZona() != null ? r.getTurno().getZona().getNombre() : "Sin zona";
            dto.setTurnoDescripcion(zona + " — " + r.getTurno().getFecha()
                    + " — " + r.getTurno().getHoraInicio() + "–" + r.getTurno().getHoraFin());
        }

        return dto;
    }

    private DocenteDTO convertDocenteToDTO(Docente d) {
        UsuarioDTO uDTO = null;
        if (d.getUsuario() != null) {
            uDTO = new UsuarioDTO(
                    d.getUsuario().getId(),
                    d.getUsuario().getNombre(),
                    d.getUsuario().getEmail(),
                    d.getUsuario().getRol(),
                    d.getUsuario().getActivo());
        }
        return new DocenteDTO(d.getId(), d.getCodigoInstitucional(), uDTO);
    }
}