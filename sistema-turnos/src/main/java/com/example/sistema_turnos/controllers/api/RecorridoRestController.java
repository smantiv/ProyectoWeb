package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.RecorridoDTO;
import com.example.sistema_turnos.services.RecorridoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recorridos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RecorridoRestController {

    @Autowired
    private RecorridoService recorridoService;

    @GetMapping
    public ResponseEntity<List<RecorridoDTO>> obtenerTodos() {
        return ResponseEntity.ok(recorridoService.obtenerTodosLosRecorridos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecorridoDTO> obtenerPorId(@PathVariable @NonNull Long id) {
        RecorridoDTO recorrido = recorridoService.obtenerRecorridoPorId(id);
        return recorrido != null ? ResponseEntity.ok(recorrido) : ResponseEntity.notFound().build();
    }

    @GetMapping("/asignacion/{asignacionId}")
    public ResponseEntity<List<RecorridoDTO>> obtenerPorAsignacion(@PathVariable @NonNull Long asignacionId) {
        return ResponseEntity.ok(recorridoService.obtenerRecorridosPorAsignacion(asignacionId));
    }

    @GetMapping("/checkpoint/{checkpointId}")
    public ResponseEntity<List<RecorridoDTO>> obtenerPorCheckpoint(@PathVariable @NonNull Long checkpointId) {
        return ResponseEntity.ok(recorridoService.obtenerRecorridosPorCheckpoint(checkpointId));
    }

    @PostMapping
    public ResponseEntity<RecorridoDTO> crear(@RequestBody @NonNull RecorridoDTO recorridoDTO) {
        try {
            RecorridoDTO recorridoCreado = recorridoService.crearRecorrido(recorridoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(recorridoCreado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecorridoDTO> actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull RecorridoDTO recorridoDTO) {
        try {
            RecorridoDTO recorridoActualizado = recorridoService.actualizarRecorrido(id, recorridoDTO);
            return recorridoActualizado != null ? ResponseEntity.ok(recorridoActualizado) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Long id) {
        return recorridoService.eliminarRecorrido(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
