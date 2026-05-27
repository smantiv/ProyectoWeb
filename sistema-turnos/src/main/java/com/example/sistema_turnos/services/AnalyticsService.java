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
import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.entities.Recorrido;
import com.example.sistema_turnos.entities.Usuario;
import com.example.sistema_turnos.repositories.RecorridoRepository;

import java.time.Duration;
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

    @Autowired
    private RecorridoRepository recorridoRepository;

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

    public Map<String, Object> obtenerIndicadores(String rango, Long zonaId) {
        DateRange dateRange = resolveDateRange(rango);

        List<AsignacionTurno> asignaciones = asignacionTurnoRepository.findAll().stream()
                .filter(asignacion -> zonaId == null || Objects.equals(resolveZonaId(asignacion), zonaId))
                .filter(asignacion -> estaEnRango(asignacion, dateRange))
                .collect(Collectors.toList());

        List<Recorrido> recorridos = recorridoRepository.findAll().stream()
                .filter(recorrido -> estaEnRango(recorrido, dateRange))
                .filter(recorrido -> zonaId == null || Objects.equals(resolveZonaId(recorrido), zonaId))
                .collect(Collectors.toList());

        List<Incidente> incidentes = incidenteRepository.findAll().stream()
                .filter(incidente -> estaEnRango(incidente, dateRange))
                .filter(incidente -> zonaId == null || Objects.equals(resolveZonaId(incidente), zonaId))
                .collect(Collectors.toList());

        long totalAsignaciones = asignaciones.size();
        long asignacionesCubiertas = asignaciones.stream().filter(this::estaCubierta).count();
        long asignacionesPuntuales = asignaciones.stream().filter(this::esPuntual).count();
        long asignacionesConRetraso = asignaciones.stream().filter(this::tieneRetraso).count();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalAsignaciones", totalAsignaciones);
        response.put("asignacionesCubiertas", asignacionesCubiertas);
        response.put("asignacionesPuntuales", asignacionesPuntuales);
        response.put("asignacionesConRetraso", asignacionesConRetraso);
        response.put("totalRecorridos", recorridos.size());
        response.put("totalIncidentes", incidentes.size());
        response.put("porcentajeCobertura", porcentaje(asignacionesCubiertas, totalAsignaciones));
        response.put("porcentajePuntualidad", porcentaje(asignacionesPuntuales, totalAsignaciones));
        response.put("promedioRecorridosPorTurno", totalAsignaciones == 0 ? 0 : redondear(recorridos.size() * 1.0 / totalAsignaciones));
        response.put("tiempoRespuestaPromedioMinutos", redondear(calcularTiempoRespuestaPromedioMinutos(incidentes)));

        return response;
    }

    public Map<String, Object> obtenerReporteSemanal() {
        LocalDate today = LocalDate.now();
        LocalDate inicioSemana = today.minusDays(today.getDayOfWeek().getValue() - 1L);
        LocalDate finSemana = inicioSemana.plusDays(6);

        DateRange dateRange = new DateRange(inicioSemana.atStartOfDay(), finSemana.atTime(LocalTime.MAX));

        List<AsignacionTurno> asignaciones = asignacionTurnoRepository.findAll().stream()
                .filter(asignacion -> estaEnRango(asignacion, dateRange))
                .collect(Collectors.toList());

        List<Recorrido> recorridos = recorridoRepository.findAll().stream()
                .filter(recorrido -> estaEnRango(recorrido, dateRange))
                .collect(Collectors.toList());

        List<Incidente> incidentes = incidenteRepository.findAll().stream()
                .filter(incidente -> estaEnRango(incidente, dateRange))
                .collect(Collectors.toList());

        long turnosCubiertos = asignaciones.stream().filter(this::estaCubierta).count();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("semanaInicio", inicioSemana.toString());
        response.put("semanaFin", finSemana.toString());
        response.put("totalTurnos", asignaciones.size());
        response.put("turnosCubiertos", turnosCubiertos);
        response.put("totalRecorridos", recorridos.size());
        response.put("totalIncidentes", incidentes.size());
        response.put("porcentajeCobertura", porcentaje(turnosCubiertos, asignaciones.size()));
        response.put("zonaMasCritica", obtenerZonaMasCritica(incidentes));
        response.put("tipoIncidenteMasFrecuente", obtenerTipoMasFrecuente(incidentes));
        response.put("detalleMapaCalor", construirFilas(incidentes, asignaciones));

        return response;
    }

    public List<Map<String, Object>> obtenerGamificacion(String rango) {
        DateRange dateRange = resolveDateRange(rango);

        List<AsignacionTurno> asignaciones = asignacionTurnoRepository.findAll().stream()
                .filter(asignacion -> estaEnRango(asignacion, dateRange))
                .collect(Collectors.toList());

        Map<Long, List<AsignacionTurno>> porDocente = asignaciones.stream()
                .filter(asignacion -> asignacion.getDocente() != null)
                .collect(Collectors.groupingBy(
                        asignacion -> asignacion.getDocente().getId(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<Map<String, Object>> ranking = new ArrayList<>();

        porDocente.forEach((docenteId, asignacionesDocente) -> {
            Docente docente = asignacionesDocente.get(0).getDocente();

            long recorridosDocente = recorridoRepository.findAll().stream()
                    .filter(recorrido -> estaEnRango(recorrido, dateRange))
                    .filter(recorrido -> recorrido.getAsignacionTurno() != null)
                    .filter(recorrido -> recorrido.getAsignacionTurno().getDocente() != null)
                    .filter(recorrido -> Objects.equals(recorrido.getAsignacionTurno().getDocente().getId(), docenteId))
                    .count();

            long incidentesDocente = incidenteRepository.findAll().stream()
                    .filter(incidente -> estaEnRango(incidente, dateRange))
                    .filter(incidente -> incidente.getAsignacionTurno() != null)
                    .filter(incidente -> incidente.getAsignacionTurno().getDocente() != null)
                    .filter(incidente -> Objects.equals(incidente.getAsignacionTurno().getDocente().getId(), docenteId))
                    .count();

            long turnosPuntuales = asignacionesDocente.stream().filter(this::esPuntual).count();

            double promedioLimpieza = asignacionesDocente.stream()
                    .map(AsignacionTurno::getCalificacionLimpieza)
                    .filter(Objects::nonNull)
                    .mapToInt(Integer::intValue)
                    .average()
                    .orElse(0);

            double puntosPuntualidad = turnosPuntuales * 20;
            double puntosRecorridos = recorridosDocente * 5;
            double puntosCalidadRegistro = promedioLimpieza * 10;
            double puntosPrevencion = incidentesDocente * 3;
            double puntajeTotal = puntosPuntualidad + puntosRecorridos + puntosCalidadRegistro + puntosPrevencion;

            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("docenteId", docenteId);
            fila.put("docente", resolveDocenteNombre(docente));
            fila.put("puntualidad", redondear(puntosPuntualidad));
            fila.put("recorridos", redondear(puntosRecorridos));
            fila.put("calidadRegistro", redondear(puntosCalidadRegistro));
            fila.put("contribucionPreventiva", redondear(puntosPrevencion));
            fila.put("puntajeTotal", redondear(puntajeTotal));
            fila.put("reconocimiento", obtenerReconocimiento(puntajeTotal));

            ranking.add(fila);
        });

        ranking.sort((a, b) -> Double.compare(
                ((Number) b.get("puntajeTotal")).doubleValue(),
                ((Number) a.get("puntajeTotal")).doubleValue()
        ));

        return ranking;
    }

    public String exportarCsv(String rango, Long zonaId, String tipo) {
        AnalyticsHeatmapResponseDTO mapa = obtenerMapaCalor(rango, zonaId, tipo);

        StringBuilder csv = new StringBuilder();
        csv.append("zona,tipo_incidente,cantidad_incidentes,porcentaje_total,incidentes_manana,incidentes_tarde,porcentaje_cobertura\n");

        for (AnalyticsHeatmapRowDTO fila : mapa.getFilas()) {
            csv.append(escapeCsv(fila.getZona())).append(",")
                    .append(escapeCsv(fila.getTipo())).append(",")
                    .append(fila.getCantidadIncidentes()).append(",")
                    .append(redondear(fila.getPorcentajeTotal())).append(",")
                    .append(fila.getIncidentesManana()).append(",")
                    .append(fila.getIncidentesTarde()).append(",")
                    .append(redondear(fila.getPorcentajeCobertura()))
                    .append("\n");
        }

        return csv.toString();
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
                    .filter(this::estaCubierta)
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

    private boolean estaEnRango(Recorrido recorrido, DateRange range) {
    LocalDateTime fechaHora = recorrido.getFechaHora();
    return fechaHora != null && !fechaHora.isBefore(range.inicio()) && !fechaHora.isAfter(range.fin());
    }

    private boolean estaCubierta(AsignacionTurno asignacion) {
        String estado = asignacion.getEstadoCobertura() != null
                ? asignacion.getEstadoCobertura().toLowerCase()
                : "";

        return asignacion.getHoraCheckin() != null
                || estado.contains("cubiert")
                || estado.contains("cerrad")
                || estado.contains("complet");
    }

    private boolean esPuntual(AsignacionTurno asignacion) {
        if (asignacion.getHoraCheckin() == null
                || asignacion.getTurno() == null
                || asignacion.getTurno().getFecha() == null
                || asignacion.getTurno().getHoraInicio() == null) {
            return false;
        }

        LocalDateTime inicio = LocalDateTime.of(
                asignacion.getTurno().getFecha(),
                asignacion.getTurno().getHoraInicio()
        );

        return !asignacion.getHoraCheckin().isAfter(inicio.plusMinutes(10));
    }

    private boolean tieneRetraso(AsignacionTurno asignacion) {
        if (asignacion.getHoraCheckin() == null
                || asignacion.getTurno() == null
                || asignacion.getTurno().getFecha() == null
                || asignacion.getTurno().getHoraInicio() == null) {
            return false;
        }

        LocalDateTime inicio = LocalDateTime.of(
                asignacion.getTurno().getFecha(),
                asignacion.getTurno().getHoraInicio()
        );

        return asignacion.getHoraCheckin().isAfter(inicio.plusMinutes(10));
    }

    private double calcularTiempoRespuestaPromedioMinutos(List<Incidente> incidentes) {
        return incidentes.stream()
                .filter(incidente -> incidente.getFechaHora() != null)
                .filter(incidente -> incidente.getAsignacionTurno() != null)
                .filter(incidente -> incidente.getAsignacionTurno().getHoraCierre() != null)
                .mapToLong(incidente -> Duration.between(
                        incidente.getFechaHora(),
                        incidente.getAsignacionTurno().getHoraCierre()
                ).toMinutes())
                .filter(minutos -> minutos >= 0)
                .average()
                .orElse(0);
    }

    private String obtenerZonaMasCritica(List<Incidente> incidentes) {
        return incidentes.stream()
                .collect(Collectors.groupingBy(this::resolveZonaNombre, Collectors.counting()))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Sin datos");
    }

    private String obtenerTipoMasFrecuente(List<Incidente> incidentes) {
        return incidentes.stream()
                .map(this::resolveTipo)
                .collect(Collectors.groupingBy(tipo -> tipo, Collectors.counting()))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Sin datos");
    }

    private String resolveDocenteNombre(Docente docente) {
        if (docente == null) {
            return "Sin docente";
        }

        Usuario usuario = docente.getUsuario();
        return usuario != null && usuario.getNombre() != null
                ? usuario.getNombre()
                : "Docente " + docente.getId();
    }

    private String obtenerReconocimiento(double puntajeTotal) {
        if (puntajeTotal >= 120) {
            return "Reconocimiento oro";
        }
        if (puntajeTotal >= 70) {
            return "Reconocimiento plata";
        }
        if (puntajeTotal >= 30) {
            return "Reconocimiento bronce";
        }
        return "En seguimiento";
    }

    private double porcentaje(long valor, long total) {
        return total == 0 ? 0 : redondear((valor * 100.0) / total);
    }

    private double redondear(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }

        String escaped = value.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }

    private Long resolveZonaId(Recorrido recorrido) {
        return recorrido.getAsignacionTurno() != null
                ? resolveZonaId(recorrido.getAsignacionTurno())
                : null;
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
        if ("90".equals(rango)) {
            return new DateRange(today.minusDays(90).atStartOfDay(), today.atTime(LocalTime.MAX));
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
