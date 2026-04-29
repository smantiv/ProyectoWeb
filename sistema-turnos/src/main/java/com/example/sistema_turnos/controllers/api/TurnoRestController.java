package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.TurnoDTO;
import com.example.sistema_turnos.services.TurnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

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
    public ResponseEntity<TurnoDTO> obtenerPorId(@PathVariable @NonNull Long id) {
        TurnoDTO turno = turnoService.obtenerTurnoPorId(id);
        return turno != null ? ResponseEntity.ok(turno) : ResponseEntity.notFound().build();
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<TurnoDTO>> obtenerPorFecha(@PathVariable @NonNull String fecha) {
        try {
            LocalDate date = Objects.requireNonNull(LocalDate.parse(fecha));
            return ResponseEntity.ok(turnoService.obtenerTodosTurnosPorFecha(date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<TurnoDTO>> obtenerPorEstado(@PathVariable @NonNull String estado) {
        return ResponseEntity.ok(turnoService.obtenerTodosTurnosPorEstado(estado));
    }

    @GetMapping("/zona/{zonaId}")
    public ResponseEntity<List<TurnoDTO>> obtenerPorZona(@PathVariable @NonNull Long zonaId) {
        return ResponseEntity.ok(turnoService.obtenerTodosTurnosPorZona(zonaId));
    }

    @GetMapping("/fecha/{fecha}/estado/{estado}")
    public ResponseEntity<List<TurnoDTO>> obtenerPorFechaYEstado(
            @PathVariable @NonNull String fecha,
            @PathVariable @NonNull String estado) {
        try {
            LocalDate date = Objects.requireNonNull(LocalDate.parse(fecha));
            return ResponseEntity.ok(turnoService.obtenerTodosTurnosPorFechaYEstado(date, estado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<TurnoDTO> crear(@RequestBody @NonNull TurnoDTO turnoDTO) {
        try {
            TurnoDTO turnoCreado = turnoService.crearTurno(turnoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(turnoCreado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurnoDTO> actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull TurnoDTO turnoDTO) {
        try {
            TurnoDTO turnoActualizado = turnoService.actualizarTurno(id, turnoDTO);
            return turnoActualizado != null ? ResponseEntity.ok(turnoActualizado) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Long id) {
        return turnoService.eliminarTurno(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
