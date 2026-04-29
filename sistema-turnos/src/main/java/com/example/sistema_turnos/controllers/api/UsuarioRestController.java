package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.UsuarioDTO;
import com.example.sistema_turnos.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UsuarioRestController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * GET /api/v1/usuarios - Obtener todos los usuarios
     */
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> obtenerTodos() {
        List<UsuarioDTO> usuarios = usuarioService.obtenerTodoLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * GET /api/v1/usuarios/{id} - Obtener usuario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable @NonNull Long id) {
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorId(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    /**
     * GET /api/v1/usuarios/email/{email} - Obtener usuario por email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioDTO> obtenerPorEmail(@PathVariable @NonNull String email) {
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorEmail(email);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    /**
     * GET /api/v1/usuarios/rol/{rol} - Obtener usuarios por rol
     */
    @GetMapping("/rol/{rol}")
    public ResponseEntity<List<UsuarioDTO>> obtenerPorRol(@PathVariable @NonNull String rol) {
        List<UsuarioDTO> usuarios = usuarioService.obtenerUsuariosPorRol(rol);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * POST /api/v1/usuarios - Crear nuevo usuario
     */
    @PostMapping
    public ResponseEntity<UsuarioDTO> crear(@RequestBody @NonNull UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO usuarioCreado = usuarioService.crearUsuario(usuarioDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCreado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/v1/usuarios/{id} - Actualizar usuario
     */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioDTO);
            if (usuarioActualizado == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(usuarioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/v1/usuarios/{id} - Eliminar usuario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable @NonNull Long id) {
        if (usuarioService.eliminarUsuario(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
