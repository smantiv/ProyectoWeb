package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.DocenteDTO;
import com.example.sistema_turnos.dtos.DocenteActualDTO;
import com.example.sistema_turnos.services.DocenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/docentes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DocenteRestController {

    @Autowired
    private DocenteService docenteService;

    /**
     * GET /api/v1/docentes - Obtener todos los docentes
     */
    @GetMapping
    public ResponseEntity<List<DocenteDTO>> obtenerTodos() {
        List<DocenteDTO> docentes = docenteService.obtenerTodosLosDocentes();
        return ResponseEntity.ok(docentes);
    }

    /**
     * GET /api/v1/docentes/{id} - Obtener docente por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocenteDTO> obtenerPorId(@PathVariable @NonNull Long id) {
        DocenteDTO docente = docenteService.obtenerDocentePorId(id);
        if (docente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(docente);
    }

    /**
     * GET /api/v1/docentes/codigo/{codigo} - Obtener docente por código institucional
     */
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<DocenteDTO> obtenerPorCodigo(@PathVariable @NonNull String codigo) {
        DocenteDTO docente = docenteService.obtenerDocentePorCodigoInstitucional(codigo);
        if (docente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(docente);
    }

    /**
     * GET /api/v1/docentes/usuario/{usuarioId} - Obtener docente por usuario ID
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<DocenteDTO> obtenerPorUsuario(@PathVariable @NonNull Long usuarioId) {
        DocenteDTO docente = docenteService.obtenerDocentePorUsuarioId(usuarioId);
        if (docente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(docente);
    }

    @GetMapping("/actual")
    public ResponseEntity<DocenteActualDTO> obtenerActual() {
        return ResponseEntity.ok(docenteService.obtenerDocenteActual());
    }

    /**
     * POST /api/v1/docentes - Crear nuevo docente
     */
    @PostMapping
    public ResponseEntity<DocenteDTO> crear(@RequestBody @NonNull DocenteDTO docenteDTO) {
        try {
            DocenteDTO docenteCreado = docenteService.crearDocente(docenteDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(docenteCreado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/v1/docentes/{id} - Actualizar docente
     */
    @PutMapping("/{id}")
    public ResponseEntity<DocenteDTO> actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull DocenteDTO docenteDTO) {
        try {
            DocenteDTO docenteActualizado = docenteService.actualizarDocente(id, docenteDTO);
            if (docenteActualizado == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(docenteActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/v1/docentes/{id} - Eliminar docente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Long id) {
        if (docenteService.eliminarDocente(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
