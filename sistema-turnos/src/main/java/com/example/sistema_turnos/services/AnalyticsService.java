package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.AnalyticsHeatmapResponseDTO;
import com.example.sistema_turnos.dtos.AnalyticsHeatmapRowDTO;
import com.example.sistema_turnos.dtos.AnalyticsHeatmapSummaryDTO;
import com.example.sistema_turnos.dtos.AnalyticsOptionDTO;
import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Incidente;
import com.example.sistema_turnos.entities.Turno;
import com.example.sistema_turnos.entities.Zona;
import com.example.sistema_turnos.repositories.AsignacionTurnoRepository;
import com.example.sistema_turnos.repositories.IncidenteRepository;
import com.example.sistema_turnos.repositories.ZonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private IncidenteRepository incidenteRepository;

    @Autowired
    private AsignacionTurnoRepository asignacionTurnoRepository;

    @Autowired
    private ZonaRepository zonaRepository;

    public AnalyticsHeatmapResponseDTO obtenerMapaCalor(String rango, Long zonaId, String tipo) {
        DateRange dateRange = resolveDateRange(rango);

        List<Incidente> incidentesFiltrados = incidenteRepository.findAll().stream()
                .filter(incidente -> estaEnRango(incidente, dateRange))
                .filter(incidente -> zonaId == null || Objects.equals(resolveZonaId(incidente), zonaId))
                .filter(incidente -> tipo == null || tipo.isBlank() || "Todos".equalsIgnoreCase(tipo)
                        || Objects.equals(resolveTipo(incidente), tipo))
                .collect(Collectors.toList());

        List<AsignacionTurno> asignacionesFiltradas = asignacionTurnoRepository.findAll().stream()
                .filter(asignacion -> zonaId == null || Objects.equals(resolveZonaId(asignacion), zonaId))
                .filter(asignacion -> estaEnRango(asignacion, dateRange))
                .collect(Collectors.toList());

        AnalyticsHeatmapResponseDTO response = new AnalyticsHeatmapResponseDTO();
        List<AnalyticsHeatmapRowDTO> filas = construirFilas(incidentesFiltrados, asignacionesFiltradas);
        response.setFilas(filas);
        response.setResumen(construirResumen(filas, incidentesFiltrados));
        response.setZonas(zonaRepository.findAll().stream()
                .map(zona -> new AnalyticsOptionDTO(zona.getId(), zona.getNombre()))
                .sorted(Comparator.comparing(AnalyticsOptionDTO::getNombre, String.CASE_INSENSITIVE_ORDER))
                .collect(Collectors.toList()));
        response.setTiposIncidente(incidenteRepository.findAll().stream()
                .map(Incidente::getTipo)
                .filter(Objects::nonNull)
                .distinct()
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .collect(Collectors.toList()));
        return response;
    }

    private List<AnalyticsHeatmapRowDTO> construirFilas(List<Incidente> incidentes, List<AsignacionTurno> asignaciones) {
        Map<String, List<Incidente>> agrupados = incidentes.stream()
                .collect(Collectors.groupingBy(
                        incidente -> resolveZonaId(incidente) + "||" + resolveZonaNombre(incidente) + "||" + resolveTipo(incidente),
                        LinkedHashMap::new,
                        Collectors.toList()));

        double totalIncidentes = incidentes.size();
        List<AnalyticsHeatmapRowDTO> filas = new ArrayList<>();

        for (Map.Entry<String, List<Incidente>> entry : agrupados.entrySet()) {
            String[] key = entry.getKey().split("\\|\\|", -1);
            Long zonaId = "null".equals(key[0]) ? null : Long.valueOf(key[0]);
            List<Incidente> incidentesZonaTipo = entry.getValue();

            long totalAsignacionesZona = asignaciones.stream()
                    .filter(asignacion -> Objects.equals(resolveZonaId(asignacion), zonaId))
                    .count();
            long asignacionesCubiertasZona = asignaciones.stream()
                    .filter(asignacion -> Objects.equals(resolveZonaId(asignacion), zonaId))
                    .filter(asignacion -> asignacion.getHoraCheckin() != null
                            || (asignacion.getEstadoCobertura() != null
                            && !"sin cobertura".equalsIgnoreCase(asignacion.getEstadoCobertura())))
                    .count();

            AnalyticsHeatmapRowDTO row = new AnalyticsHeatmapRowDTO();
            row.setZonaId(zonaId);
            row.setZona(key[1]);
            row.setTipo(key[2]);
            row.setCantidadIncidentes(incidentesZonaTipo.size());
            row.setPorcentajeTotal(totalIncidentes == 0 ? 0 : (incidentesZonaTipo.size() * 100.0) / totalIncidentes);
            row.setIncidentesManana(incidentesZonaTipo.stream().filter(this::esIncidenteManana).count());
            row.setIncidentesTarde(incidentesZonaTipo.stream().filter(incidente -> !esIncidenteManana(incidente)).count());
            row.setPorcentajeCobertura(totalAsignacionesZona == 0 ? 0 : (asignacionesCubiertasZona * 100.0) / totalAsignacionesZona);
            filas.add(row);
        }

        filas.sort(Comparator.comparingLong(AnalyticsHeatmapRowDTO::getCantidadIncidentes).reversed()
                .thenComparing(AnalyticsHeatmapRowDTO::getZona, String.CASE_INSENSITIVE_ORDER));
        return filas;
    }

    private AnalyticsHeatmapSummaryDTO construirResumen(List<AnalyticsHeatmapRowDTO> filas, List<Incidente> incidentes) {
        AnalyticsHeatmapSummaryDTO resumen = new AnalyticsHeatmapSummaryDTO();
        resumen.setTotalIncidentes(incidentes.size());
        resumen.setZonasConIncidentes(filas.stream().map(AnalyticsHeatmapRowDTO::getZona).distinct().count());
        resumen.setZonaTop(filas.isEmpty() ? "-" : filas.get(0).getZona());
        resumen.setTiposVisibles(incidentes.stream().map(this::resolveTipo).distinct().count());
        return resumen;
    }

    private boolean estaEnRango(Incidente incidente, DateRange range) {
        LocalDateTime fechaHora = incidente.getFechaHora();
        return fechaHora != null && !fechaHora.isBefore(range.inicio()) && !fechaHora.isAfter(range.fin());
    }

    private boolean estaEnRango(AsignacionTurno asignacion, DateRange range) {
        Turno turno = asignacion.getTurno();
        if (turno == null || turno.getFecha() == null) {
            return false;
        }

        LocalDateTime fechaInicio = turno.getFecha().atTime(turno.getHoraInicio() != null ? turno.getHoraInicio() : LocalTime.MIN);
        return !fechaInicio.isBefore(range.inicio()) && !fechaInicio.isAfter(range.fin());
    }

    private boolean esIncidenteManana(Incidente incidente) {
        return incidente.getFechaHora() != null && incidente.getFechaHora().toLocalTime().isBefore(LocalTime.NOON);
    }

    private Long resolveZonaId(Incidente incidente) {
        Zona zona = resolveZona(incidente);
        return zona != null ? zona.getId() : null;
    }

    private Long resolveZonaId(AsignacionTurno asignacion) {
        Zona zona = resolveZona(asignacion);
        return zona != null ? zona.getId() : null;
    }

    private String resolveZonaNombre(Incidente incidente) {
        Zona zona = resolveZona(incidente);
        return zona != null ? zona.getNombre() : "Sin zona";
    }

    private String resolveTipo(Incidente incidente) {
        return incidente.getTipo() != null ? incidente.getTipo() : "Sin tipo";
    }

    private Zona resolveZona(Incidente incidente) {
        if (incidente.getAsignacionTurno() == null || incidente.getAsignacionTurno().getTurno() == null) {
            return null;
        }
        return incidente.getAsignacionTurno().getTurno().getZona();
    }

    private Zona resolveZona(AsignacionTurno asignacion) {
        return asignacion.getTurno() != null ? asignacion.getTurno().getZona() : null;
    }

    private DateRange resolveDateRange(String rango) {
        LocalDate today = LocalDate.now();
        if (rango == null || rango.isBlank() || "7".equals(rango)) {
            return new DateRange(today.minusDays(7).atStartOfDay(), today.atTime(LocalTime.MAX));
        }
        if ("30".equals(rango)) {
            return new DateRange(today.minusDays(30).atStartOfDay(), today.atTime(LocalTime.MAX));
        }
        if ("currentMonth".equals(rango)) {
            LocalDate inicio = today.withDayOfMonth(1);
            return new DateRange(inicio.atStartOfDay(), today.atTime(LocalTime.MAX));
        }
        if ("previousMonth".equals(rango)) {
            LocalDate inicio = today.minusMonths(1).withDayOfMonth(1);
            LocalDate fin = inicio.withDayOfMonth(inicio.lengthOfMonth());
            return new DateRange(inicio.atStartOfDay(), fin.atTime(LocalTime.MAX));
        }
        return new DateRange(LocalDate.of(2000, 1, 1).atStartOfDay(), today.plusYears(10).atTime(LocalTime.MAX));
    }

    private record DateRange(LocalDateTime inicio, LocalDateTime fin) {
    }
}
