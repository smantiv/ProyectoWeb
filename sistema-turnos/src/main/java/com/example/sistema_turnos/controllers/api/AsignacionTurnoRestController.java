package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.ApiMessageDTO;
import com.example.sistema_turnos.dtos.AsignacionTurnoDTO;
import com.example.sistema_turnos.dtos.CierreTurnoDTO;
import com.example.sistema_turnos.dtos.CheckinRequestDTO;
import com.example.sistema_turnos.dtos.MisTurnosPanelDTO;
import com.example.sistema_turnos.dtos.TurnoActivoDTO;
import com.example.sistema_turnos.services.AsignacionTurnoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/asignaciones-turnos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AsignacionTurnoRestController {

    @Autowired
    private AsignacionTurnoService asignacionTurnoService;

    @GetMapping
    public ResponseEntity<List<AsignacionTurnoDTO>> obtenerTodas() {
        return ResponseEntity.ok(asignacionTurnoService.obtenerTodasLasAsignaciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsignacionTurnoDTO> obtenerPorId(@PathVariable @NonNull Long id) {
        AsignacionTurnoDTO asignacion = asignacionTurnoService.obtenerAsignacionPorId(id);
        return asignacion != null ? ResponseEntity.ok(asignacion) : ResponseEntity.notFound().build();
    }

    @GetMapping("/docente/{docenteId}")
    public ResponseEntity<List<AsignacionTurnoDTO>> obtenerPorDocente(@PathVariable @NonNull Long docenteId) {
        return ResponseEntity.ok(asignacionTurnoService.obtenerAsignacionesPorDocente(docenteId));
    }

    @GetMapping("/actual/panel")
    public ResponseEntity<MisTurnosPanelDTO> obtenerPanelDocenteActual() {
        return ResponseEntity.ok(asignacionTurnoService.obtenerPanelDocenteActual());
    }

    @GetMapping("/activas")
    public ResponseEntity<List<TurnoActivoDTO>> obtenerTurnosActivos() {
        return ResponseEntity.ok(asignacionTurnoService.obtenerTurnosActivos());
    }

    @PostMapping
    public ResponseEntity<AsignacionTurnoDTO> crear(@Valid @RequestBody @NonNull AsignacionTurnoDTO asignacionDTO) {
        try {
            AsignacionTurnoDTO asignacionCreada = asignacionTurnoService.crearAsignacionTurno(asignacionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(asignacionCreada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsignacionTurnoDTO> actualizar(
            @PathVariable @NonNull Long id,
            @Valid @RequestBody @NonNull AsignacionTurnoDTO asignacionDTO) {
        try {
            AsignacionTurnoDTO asignacionActualizada = asignacionTurnoService.actualizarAsignacion(id, asignacionDTO);
            return asignacionActualizada != null ? ResponseEntity.ok(asignacionActualizada) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<?> registrarCheckin(
            @PathVariable @NonNull Long id,
            @RequestBody CheckinRequestDTO checkinRequestDTO) {
        try {
            AsignacionTurnoDTO asignacionActualizada = asignacionTurnoService.registrarCheckin(id, checkinRequestDTO);
            return asignacionActualizada != null
                    ? ResponseEntity.ok(asignacionActualizada)
                    : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ApiMessageDTO(e.getMessage()));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiMessageDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiMessageDTO("No se pudo registrar el check-in."));
        }
    }

    @PostMapping("/{id}/cierre")
    public ResponseEntity<AsignacionTurnoDTO> cerrarTurno(
            @PathVariable @NonNull Long id,
            @Valid @RequestBody @NonNull CierreTurnoDTO cierreTurnoDTO) {
        try {
            AsignacionTurnoDTO asignacionActualizada = asignacionTurnoService.cerrarTurno(id, cierreTurnoDTO);
            return asignacionActualizada != null
                    ? ResponseEntity.ok(asignacionActualizada)
                    : ResponseEntity.notFound().build();
        } catch (Exception e) {
            if (e instanceof AccessDeniedException) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Long id) {
        return asignacionTurnoService.eliminarAsignacion(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
