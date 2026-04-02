package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.TurnoDTO;
import com.example.sistema_turnos.services.TurnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/turnos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TurnoRestController {

    @Autowired
    private TurnoService turnoService;

    @GetMapping
    public ResponseEntity<List<TurnoDTO>> obtenerTodos() {
        return ResponseEntity.ok(turnoService.obtenerTodosTurnos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurnoDTO> obtenerPorId(@PathVariable Long id) {
        TurnoDTO turno = turnoService.obtenerTurnoPorId(id);
        return turno != null ? ResponseEntity.ok(turno) : ResponseEntity.notFound().build();
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<TurnoDTO>> obtenerPorFecha(@PathVariable String fecha) {
        try {
            LocalDate date = LocalDate.parse(fecha);
            return ResponseEntity.ok(turnoService.obtenerTodosTurnosPorFecha(date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<TurnoDTO>> obtenerPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(turnoService.obtenerTodosTurnosPorEstado(estado));
    }

    @GetMapping("/zona/{zonaId}")
    public ResponseEntity<List<TurnoDTO>> obtenerPorZona(@PathVariable Long zonaId) {
        return ResponseEntity.ok(turnoService.obtenerTodosTurnosPorZona(zonaId));
    }

    @GetMapping("/fecha/{fecha}/estado/{estado}")
    public ResponseEntity<List<TurnoDTO>> obtenerPorFechaYEstado(
            @PathVariable String fecha, 
            @PathVariable String estado) {
        try {
            LocalDate date = LocalDate.parse(fecha);
            return ResponseEntity.ok(turnoService.obtenerTodosTurnosPorFechaYEstado(date, estado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<TurnoDTO> crear(@RequestBody TurnoDTO turnoDTO) {
        try {
            TurnoDTO turnoCreado = turnoService.crearTurno(turnoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(turnoCreado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurnoDTO> actualizar(@PathVariable Long id, @RequestBody TurnoDTO turnoDTO) {
        try {
            TurnoDTO turnoActualizado = turnoService.actualizarTurno(id, turnoDTO);
            return turnoActualizado != null ? ResponseEntity.ok(turnoActualizado) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return turnoService.eliminarTurno(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
