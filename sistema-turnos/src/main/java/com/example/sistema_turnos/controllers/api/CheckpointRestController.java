package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.CheckpointDTO;
import com.example.sistema_turnos.services.CheckpointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/checkpoints")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CheckpointRestController {

    @Autowired
    private CheckpointService checkpointService;

    @GetMapping
    public ResponseEntity<List<CheckpointDTO>> obtenerTodos() {
        return ResponseEntity.ok(checkpointService.obtenerTodosLosCheckpoints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CheckpointDTO> obtenerPorId(@PathVariable @NonNull Long id) {
        CheckpointDTO checkpoint = checkpointService.obtenerCheckpointPorId(id);
        return checkpoint != null ? ResponseEntity.ok(checkpoint) : ResponseEntity.notFound().build();
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<CheckpointDTO> obtenerPorNombre(@PathVariable @NonNull String nombre) {
        CheckpointDTO checkpoint = checkpointService.obtenerCheckpointPorNombre(nombre);
        return checkpoint != null ? ResponseEntity.ok(checkpoint) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<CheckpointDTO> crear(@RequestBody @NonNull CheckpointDTO checkpointDTO) {
        try {
            CheckpointDTO checkpointCreado = checkpointService.crearCheckpoint(checkpointDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(checkpointCreado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CheckpointDTO> actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull CheckpointDTO checkpointDTO) {
        try {
            CheckpointDTO checkpointActualizado = checkpointService.actualizarCheckpoint(id, checkpointDTO);
            return checkpointActualizado != null ? ResponseEntity.ok(checkpointActualizado) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Long id) {
        return checkpointService.eliminarCheckpoint(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
