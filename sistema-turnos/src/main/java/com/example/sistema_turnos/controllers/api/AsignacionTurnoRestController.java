package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.AsignacionTurnoDTO;
import com.example.sistema_turnos.services.AsignacionTurnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<AsignacionTurnoDTO> obtenerPorId(@PathVariable Long id) {
        AsignacionTurnoDTO asignacion = asignacionTurnoService.obtenerAsignacionPorId(id);
        return asignacion != null ? ResponseEntity.ok(asignacion) : ResponseEntity.notFound().build();
    }

    @GetMapping("/docente/{docenteId}")
    public ResponseEntity<List<AsignacionTurnoDTO>> obtenerPorDocente(@PathVariable Long docenteId) {
        return ResponseEntity.ok(asignacionTurnoService.obtenerAsignacionesPorDocente(docenteId));
    }

    @PostMapping
    public ResponseEntity<AsignacionTurnoDTO> crear(@RequestBody AsignacionTurnoDTO asignacionDTO) {
        try {
            AsignacionTurnoDTO asignacionCreada = asignacionTurnoService.crearAsignacionTurno(asignacionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(asignacionCreada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsignacionTurnoDTO> actualizar(@PathVariable Long id, @RequestBody AsignacionTurnoDTO asignacionDTO) {
        try {
            AsignacionTurnoDTO asignacionActualizada = asignacionTurnoService.actualizarAsignacion(id, asignacionDTO);
            return asignacionActualizada != null ? ResponseEntity.ok(asignacionActualizada) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return asignacionTurnoService.eliminarAsignacion(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
