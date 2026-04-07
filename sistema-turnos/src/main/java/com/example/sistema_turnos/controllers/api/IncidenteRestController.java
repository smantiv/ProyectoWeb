package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.IncidenteDTO;
import com.example.sistema_turnos.services.IncidenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incidentes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class IncidenteRestController {

    @Autowired
    private IncidenteService incidenteService;

    @GetMapping
    public ResponseEntity<List<IncidenteDTO>> obtenerTodos() {
        return ResponseEntity.ok(incidenteService.obtenerTodosLosIncidentes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidenteDTO> obtenerPorId(@PathVariable Long id) {
        IncidenteDTO incidente = incidenteService.obtenerIncidentePorId(id);
        return incidente != null
                ? ResponseEntity.ok(incidente)
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/asignacion/{asignacionId}")
    public ResponseEntity<List<IncidenteDTO>> obtenerPorAsignacion(@PathVariable Long asignacionId) {
        return ResponseEntity.ok(incidenteService.obtenerIncidentesPorAsignacion(asignacionId));
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<IncidenteDTO>> obtenerPorTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(incidenteService.obtenerIncidentesPorTipo(tipo));
    }

    @GetMapping("/severidad/{severidad}")
    public ResponseEntity<List<IncidenteDTO>> obtenerPorSeveridad(@PathVariable String severidad) {
        return ResponseEntity.ok(incidenteService.obtenerIncidentesPorSeveridad(severidad));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<IncidenteDTO>> obtenerPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(incidenteService.obtenerIncidentesPorEstado(estado));
    }

    @PostMapping
    public ResponseEntity<IncidenteDTO> crear(@RequestBody IncidenteDTO incidenteDTO) {
        try {
            IncidenteDTO incidenteCreado = incidenteService.crearIncidente(incidenteDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(incidenteCreado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidenteDTO> actualizar(@PathVariable Long id, @RequestBody IncidenteDTO incidenteDTO) {
        try {
            IncidenteDTO incidenteActualizado = incidenteService.actualizarIncidente(id, incidenteDTO);
            return incidenteActualizado != null
                    ? ResponseEntity.ok(incidenteActualizado)
                    : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return incidenteService.eliminarIncidente(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}