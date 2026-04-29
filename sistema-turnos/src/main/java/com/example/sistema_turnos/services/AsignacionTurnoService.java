package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.AsignacionTurnoDTO;
import com.example.sistema_turnos.dtos.AsignacionTurnoDetalleDTO;
import com.example.sistema_turnos.dtos.CierreTurnoDTO;
import com.example.sistema_turnos.dtos.MisTurnosDiaDTO;
import com.example.sistema_turnos.dtos.MisTurnosPanelDTO;
import com.example.sistema_turnos.dtos.MisTurnosResumenDTO;
import com.example.sistema_turnos.dtos.TurnoActivoDTO;
import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.entities.Turno;
import com.example.sistema_turnos.repositories.AsignacionTurnoRepository;
import com.example.sistema_turnos.repositories.DocenteRepository;
import com.example.sistema_turnos.repositories.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
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

    @Autowired
    private CurrentDocenteContextService currentDocenteContextService;

    public AsignacionTurnoDTO crearAsignacionTurno(@NonNull AsignacionTurnoDTO asignacionTurnoDTO) {
        AsignacionTurno asignacion = new AsignacionTurno();
        asignacion.setHoraCheckin(asignacionTurnoDTO.getHoraCheckin());
        asignacion.setHoraCierre(asignacionTurnoDTO.getHoraCierre());
        asignacion.setCalificacionLimpieza(asignacionTurnoDTO.getCalificacionLimpieza());
        asignacion.setEstadoCobertura(asignacionTurnoDTO.getEstadoCobertura());
        asignacion.setObservacionLimpieza(asignacionTurnoDTO.getObservacionLimpieza()); 

        Long docenteId = asignacionTurnoDTO.getDocenteId();
        if (docenteId != null) {
            Optional<Docente> docente = docenteRepository.findById(docenteId);
            docente.ifPresent(asignacion::setDocente);
        }

        Long turnoId = asignacionTurnoDTO.getTurnoId();
        if (turnoId != null) {
            Optional<Turno> turno = turnoRepository.findById(turnoId);
            turno.ifPresent(asignacion::setTurno);
        }

        AsignacionTurno asignacionGuardada = asignacionTurnoRepository.save(asignacion);
        return convertToDTO(asignacionGuardada);
    }

    public AsignacionTurnoDTO obtenerAsignacionPorId(@NonNull Long id) {
        Optional<AsignacionTurno> asignacion = asignacionTurnoRepository.findById(id);
        return asignacion.map(this::convertToDTO).orElse(null);
    }

    public List<AsignacionTurnoDTO> obtenerAsignacionesPorDocente(@NonNull Long docenteId) {
        return asignacionTurnoRepository.findByDocenteId(docenteId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AsignacionTurnoDTO> obtenerTodasLasAsignaciones() {
        return asignacionTurnoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AsignacionTurnoDTO actualizarAsignacion(@NonNull Long id, @NonNull AsignacionTurnoDTO asignacionTurnoDTO) {
        Optional<AsignacionTurno> asignacionExistente = asignacionTurnoRepository.findById(id);
        if (asignacionExistente.isEmpty()) {
            return null;
        }

        AsignacionTurno asignacion = asignacionExistente.get();
        asignacion.setHoraCheckin(asignacionTurnoDTO.getHoraCheckin());
        asignacion.setHoraCierre(asignacionTurnoDTO.getHoraCierre());
        asignacion.setCalificacionLimpieza(asignacionTurnoDTO.getCalificacionLimpieza());
        asignacion.setEstadoCobertura(asignacionTurnoDTO.getEstadoCobertura());

        Long docenteId = asignacionTurnoDTO.getDocenteId();
        if (docenteId != null) {
            Optional<Docente> docente = docenteRepository.findById(docenteId);
            docente.ifPresent(asignacion::setDocente);
        }

        Long turnoId = asignacionTurnoDTO.getTurnoId();
        if (turnoId != null) {
            Optional<Turno> turno = turnoRepository.findById(turnoId);
            turno.ifPresent(asignacion::setTurno);
        }

        AsignacionTurno asignacionActualizada = asignacionTurnoRepository.save(asignacion);
        return convertToDTO(asignacionActualizada);
    }

    public AsignacionTurnoDTO registrarCheckin(@NonNull Long id) {
        Optional<AsignacionTurno> asignacionExistente = asignacionTurnoRepository.findById(id);
        if (asignacionExistente.isEmpty()) {
            return null;
        }

        AsignacionTurno asignacion = asignacionExistente.get();
        asignacion.setHoraCheckin(LocalDateTime.now());
        asignacion.setEstadoCobertura("cubierta");

        AsignacionTurno asignacionActualizada = asignacionTurnoRepository.save(asignacion);
        return convertToDTO(asignacionActualizada);
    }

    public AsignacionTurnoDTO cerrarTurno(@NonNull Long id, @NonNull CierreTurnoDTO cierreTurnoDTO) {
        Optional<AsignacionTurno> asignacionExistente = asignacionTurnoRepository.findById(id);
        if (asignacionExistente.isEmpty()) {
            return null;
        }

        AsignacionTurno asignacion = asignacionExistente.get();
        // El cierre usa un DTO dedicado para aceptar solo el contrato real del endpoint.
        asignacion.setHoraCierre(cierreTurnoDTO.getHoraCierre());
        asignacion.setCalificacionLimpieza(cierreTurnoDTO.getCalificacionLimpieza());
        asignacion.setEstadoCobertura(cierreTurnoDTO.getEstadoCobertura());

        AsignacionTurno asignacionActualizada = asignacionTurnoRepository.save(asignacion);
        return convertToDTO(asignacionActualizada);
    }

    public MisTurnosPanelDTO obtenerPanelDocenteActual() {
        Long docenteId = currentDocenteContextService.obtenerDocenteActualId();
        List<AsignacionTurno> asignaciones = asignacionTurnoRepository.findByDocenteId(docenteId);
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1L);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        MisTurnosResumenDTO resumen = new MisTurnosResumenDTO();
        resumen.setTotalTurnosSemana(asignaciones.stream()
                .filter(asignacion -> turnoEnRango(asignacion.getTurno(), startOfWeek, endOfWeek))
                .count());
        resumen.setTurnosCompletados(asignaciones.stream().filter(this::estaCompletado).count());
        resumen.setProximoTurno(asignaciones.stream()
                .map(this::toDetalleDTO)
                .filter(detalle -> detalle.getFecha() != null && detalle.getHoraInicio() != null)
                .filter(detalle -> !detalle.getFecha().atTime(detalle.getHoraInicio()).isBefore(LocalDateTime.now()))
                .sorted(Comparator.comparing(detalle -> detalle.getFecha().atTime(detalle.getHoraInicio())))
                .findFirst()
                .map(this::formatProximoTurno)
                .orElse("Sin turnos programados"));

        List<MisTurnosDiaDTO> vistaSemanal = startOfWeek.datesUntil(endOfWeek.plusDays(1))
                .map(fecha -> {
                    MisTurnosDiaDTO dia = new MisTurnosDiaDTO();
                    dia.setFecha(fecha);
                    dia.setEtiqueta(capitalize(fecha.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.of("es", "ES")))
                            + " " + fecha.getDayOfMonth());
                    dia.setCantidadTurnos(asignaciones.stream()
                            .filter(asignacion -> asignacion.getTurno() != null && fecha.equals(asignacion.getTurno().getFecha()))
                            .count());
                    return dia;
                })
                .collect(Collectors.toList());

        MisTurnosPanelDTO panel = new MisTurnosPanelDTO();
        panel.setResumen(resumen);
        panel.setVistaSemanal(vistaSemanal);
        panel.setTurnos(asignaciones.stream()
                .map(this::toDetalleDTO)
                .sorted(Comparator.comparing(AsignacionTurnoDetalleDTO::getFecha, Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(AsignacionTurnoDetalleDTO::getHoraInicio, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList()));
        return panel;
    }

    public List<TurnoActivoDTO> obtenerTurnosActivos() {
        return asignacionTurnoRepository.findAll().stream()
                .filter(asignacion -> asignacion.getHoraCheckin() != null)
                .filter(asignacion -> asignacion.getHoraCierre() == null)
                .map(asignacion -> {
                    TurnoActivoDTO dto = new TurnoActivoDTO();
                    dto.setAsignacionId(asignacion.getId());
                    dto.setDocenteNombre(asignacion.getDocente() != null && asignacion.getDocente().getUsuario() != null
                            ? asignacion.getDocente().getUsuario().getNombre()
                            : "Sin docente");
                    dto.setZona(asignacion.getTurno() != null && asignacion.getTurno().getZona() != null
                            ? asignacion.getTurno().getZona().getNombre()
                            : "Sin zona");
                    dto.setHoraInicio(asignacion.getTurno() != null && asignacion.getTurno().getHoraInicio() != null
                            ? asignacion.getTurno().getHoraInicio().toString()
                            : "--:--");
                    dto.setEstado("Activo");
                    return dto;
                })
                .sorted(Comparator.comparing(TurnoActivoDTO::getHoraInicio))
                .collect(Collectors.toList());
    }

    public boolean eliminarAsignacion(@NonNull Long id) {
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

    private AsignacionTurnoDetalleDTO toDetalleDTO(AsignacionTurno asignacion) {
        AsignacionTurnoDetalleDTO dto = new AsignacionTurnoDetalleDTO();
        dto.setAsignacionId(asignacion.getId());
        dto.setTurnoId(asignacion.getTurno() != null ? asignacion.getTurno().getId() : null);
        dto.setFecha(asignacion.getTurno() != null ? asignacion.getTurno().getFecha() : null);
        dto.setHoraInicio(asignacion.getTurno() != null ? asignacion.getTurno().getHoraInicio() : null);
        dto.setHoraFin(asignacion.getTurno() != null ? asignacion.getTurno().getHoraFin() : null);
        dto.setZona(asignacion.getTurno() != null && asignacion.getTurno().getZona() != null
                ? asignacion.getTurno().getZona().getNombre()
                : "Sin zona");
        dto.setEstado(asignacion.getEstadoCobertura() != null ? asignacion.getEstadoCobertura() : "Sin estado");
        dto.setHoraCheckin(asignacion.getHoraCheckin());
        return dto;
    }

    private boolean turnoEnRango(Turno turno, LocalDate inicio, LocalDate fin) {
        return turno != null && turno.getFecha() != null
                && !turno.getFecha().isBefore(inicio)
                && !turno.getFecha().isAfter(fin);
    }

    private boolean estaCompletado(AsignacionTurno asignacion) {
        String estado = asignacion.getEstadoCobertura() != null ? asignacion.getEstadoCobertura().toLowerCase() : "";
        return asignacion.getHoraCierre() != null || estado.contains("cerrad") || estado.contains("complet");
    }

    private String formatProximoTurno(AsignacionTurnoDetalleDTO detalle) {
        return detalle.getFecha() + " " + String.valueOf(detalle.getHoraInicio()).substring(0, 5)
                + " - " + detalle.getZona();
    }

    private String capitalize(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1).toLowerCase();
    }
}
