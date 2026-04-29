package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.DocenteDTO;
import com.example.sistema_turnos.dtos.ReasignacionDTO;
import com.example.sistema_turnos.services.ReasignacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/reasignaciones")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReasignacionRestController {

    @Autowired
    private ReasignacionService reasignacionService;

    @GetMapping
    public ResponseEntity<List<ReasignacionDTO>> obtenerTodas() {
        return ResponseEntity.ok(reasignacionService.obtenerTodasLasReasignaciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReasignacionDTO> obtenerPorId(@PathVariable @NonNull Long id) {
        ReasignacionDTO r = reasignacionService.obtenerReasignacionPorId(id);
        return r != null ? ResponseEntity.ok(r) : ResponseEntity.notFound().build();
    }

    @GetMapping("/docente/{docenteId}")
    public ResponseEntity<List<ReasignacionDTO>> obtenerPorDocente(@PathVariable @NonNull Long docenteId) {
        return ResponseEntity.ok(reasignacionService.obtenerReasignacionesPorDocente(docenteId));
    }

    @GetMapping("/actual")
    public ResponseEntity<List<ReasignacionDTO>> obtenerActuales() {
        Long docenteActualId = Objects.requireNonNull(reasignacionService.obtenerDocenteActualId());
        return ResponseEntity.ok(
                reasignacionService.obtenerReasignacionesPorDocente(docenteActualId)
        );
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ReasignacionDTO>> obtenerPorEstado(@PathVariable @NonNull String estado) {
        return ResponseEntity.ok(reasignacionService.obtenerReasignacionesPorEstado(estado));
    }

    @GetMapping("/docente/{docenteId}/estado/{estado}")
    public ResponseEntity<List<ReasignacionDTO>> obtenerPorDocenteYEstado(
            @PathVariable @NonNull Long docenteId, @PathVariable @NonNull String estado) {
        return ResponseEntity.ok(reasignacionService.obtenerReasignacionesPorDocenteYEstado(docenteId, estado));
    }

    // GET /api/v1/reasignaciones/candidatos/{turnoId}
    // Devuelve docentes disponibles para cubrir ese turno
    @GetMapping("/candidatos/{turnoId}")
    public ResponseEntity<List<DocenteDTO>> obtenerCandidatos(@PathVariable @NonNull Long turnoId) {
        return ResponseEntity.ok(reasignacionService.obtenerCandidatos(turnoId));
    }

    // POST /api/v1/reasignaciones
    // Body: { "docenteId": 1, "turnoId": 2, "motivo": "Cita médica" }
    @PostMapping
    public ResponseEntity<ReasignacionDTO> crear(@RequestBody @NonNull ReasignacionDTO dto) {
        try {
            // El docente solicitante se resuelve en el servidor para eliminar IDs hardcodeados.
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(reasignacionService.crearReasignacion(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT /api/v1/reasignaciones/{id}/responder
    // Body: { "docenteReemplazoId": 3, "decision": "aceptada" }
    @PutMapping("/{id}/responder")
    public ResponseEntity<ReasignacionDTO> responder(
            @PathVariable @NonNull Long id, @RequestBody @NonNull Map<String, Object> body) {
        try {
            String decision = Objects.requireNonNull(body.get("decision"), "decision requerida").toString();
            Long reemplazoId = body.containsKey("docenteReemplazoId") && body.get("docenteReemplazoId") != null
                    ? Long.valueOf(body.get("docenteReemplazoId").toString()) : null;
            ReasignacionDTO result = reasignacionService.responder(id, reemplazoId, Objects.requireNonNull(decision));
            return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReasignacionDTO> actualizar(
            @PathVariable @NonNull Long id, @RequestBody @NonNull ReasignacionDTO dto) {
        try {
            ReasignacionDTO actualizada = reasignacionService.actualizarReasignacion(id, dto);
            return actualizada != null ? ResponseEntity.ok(actualizada) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Long id) {
        return reasignacionService.eliminarReasignacion(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
