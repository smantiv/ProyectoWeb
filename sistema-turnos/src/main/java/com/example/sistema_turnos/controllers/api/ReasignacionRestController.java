package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.ReasignacionDTO;
import com.example.sistema_turnos.services.ReasignacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<ReasignacionDTO> obtenerPorId(@PathVariable Long id) {
        ReasignacionDTO reasignacion = reasignacionService.obtenerReasignacionPorId(id);
        return reasignacion != null ? ResponseEntity.ok(reasignacion) : ResponseEntity.notFound().build();
    }

    @GetMapping("/docente/{docenteId}")
    public ResponseEntity<List<ReasignacionDTO>> obtenerPorDocente(@PathVariable Long docenteId) {
        return ResponseEntity.ok(reasignacionService.obtenerReasignacionesPorDocente(docenteId));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ReasignacionDTO>> obtenerPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(reasignacionService.obtenerReasignacionesPorEstado(estado));
    }

    @GetMapping("/docente/{docenteId}/estado/{estado}")
    public ResponseEntity<List<ReasignacionDTO>> obtenerPorDocenteYEstado(
            @PathVariable Long docenteId,
            @PathVariable String estado) {
        return ResponseEntity.ok(reasignacionService.obtenerReasignacionesPorDocenteYEstado(docenteId, estado));
    }

    @PostMapping
    public ResponseEntity<ReasignacionDTO> crear(@RequestBody ReasignacionDTO reasignacionDTO) {
        try {
            ReasignacionDTO reasignacionCreada = reasignacionService.crearReasignacion(reasignacionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(reasignacionCreada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReasignacionDTO> actualizar(@PathVariable Long id, @RequestBody ReasignacionDTO reasignacionDTO) {
        try {
            ReasignacionDTO reasignacionActualizada = reasignacionService.actualizarReasignacion(id, reasignacionDTO);
            return reasignacionActualizada != null ? ResponseEntity.ok(reasignacionActualizada) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return reasignacionService.eliminarReasignacion(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
