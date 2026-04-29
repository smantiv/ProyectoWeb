package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.ZonaDTO;
import com.example.sistema_turnos.services.ZonaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/zonas")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ZonaRestController {

    @Autowired
    private ZonaService zonaService;

    @GetMapping
    public ResponseEntity<List<ZonaDTO>> obtenerTodas() {
        return ResponseEntity.ok(zonaService.obtenerTodasLasZonas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ZonaDTO> obtenerPorId(@PathVariable @NonNull Long id) {
        ZonaDTO zona = zonaService.obtenerZonaPorId(id);
        return zona != null ? ResponseEntity.ok(zona) : ResponseEntity.notFound().build();
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<ZonaDTO> obtenerPorNombre(@PathVariable @NonNull String nombre) {
        ZonaDTO zona = zonaService.obtenerZonaPorNombre(nombre);
        return zona != null ? ResponseEntity.ok(zona) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ZonaDTO> crear(@RequestBody @NonNull ZonaDTO zonaDTO) {
        try {
            ZonaDTO zonaCreada = zonaService.crearZona(zonaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(zonaCreada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ZonaDTO> actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull ZonaDTO zonaDTO) {
        try {
            ZonaDTO zonaActualizada = zonaService.actualizarZona(id, zonaDTO);
            return zonaActualizada != null ? ResponseEntity.ok(zonaActualizada) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Long id) {
        return zonaService.eliminarZona(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
