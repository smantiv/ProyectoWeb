package com.example.sistema_turnos.controllers;

import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.entities.Usuario;
import com.example.sistema_turnos.repositories.DocenteRepository;
import com.example.sistema_turnos.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String usuario = credentials.getOrDefault("usuario", credentials.getOrDefault("email", "")).trim();
        String contrasena = credentials.getOrDefault("contrasena", "");

        if (usuario.isBlank() || contrasena.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Usuario y contrasena son obligatorios."));
        }

        if ("coordinador".equalsIgnoreCase(usuario) && "1234".equals(contrasena)) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", "demo-coordinador-token");
            response.put("user", Map.of(
                    "id", 0,
                    "nombre", "Coordinacion General",
                    "email", "coordinador@sistema.local",
                    "rol", "coordinador"
            ));
            return ResponseEntity.ok(response);
        }

        Optional<Usuario> usuarioEncontrado = buscarUsuarioDemo(usuario);
        if (usuarioEncontrado.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuario no encontrado."));
        }

        Usuario usuarioEntity = usuarioEncontrado.get();
        if (!usuarioEntity.getPassword().equals(contrasena)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales invalidas."));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", usuarioEntity.getId());
        userData.put("nombre", usuarioEntity.getNombre());
        userData.put("email", usuarioEntity.getEmail());
        userData.put("rol", normalizarRol(usuarioEntity.getRol()));

        Optional<Docente> docente = docenteRepository.findByUsuarioId(usuarioEntity.getId());
        docente.ifPresent(value -> userData.put("docenteId", value.getId()));

        Map<String, Object> response = new HashMap<>();
        response.put("token", "demo-token-" + usuarioEntity.getId());
        response.put("user", userData);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/turnos")
    public List<Map<String, Object>> getTurnos() {
        return List.of(
                Map.of("id", 1, "fecha", "2026-03-18", "horaInicio", "07:00", "horaFin", "09:00", "zona", "Zona A", "estado", "PENDIENTE"),
                Map.of("id", 2, "fecha", "2026-03-18", "horaInicio", "09:00", "horaFin", "11:00", "zona", "Zona B", "estado", "PENDIENTE")
        );
    }

    @PostMapping("/contacto")
    public Map<String, String> contacto(@RequestBody Map<String, String> data) {
        String nombre = data.getOrDefault("nombre", "Usuario");
        return Map.of("mensaje", "Mensaje recibido correctamente de " + nombre + ".");
    }

    private Optional<Usuario> buscarUsuarioDemo(String usuario) {
        if ("admin".equalsIgnoreCase(usuario)) {
            return usuarioRepository.findByRol("ADMIN").stream().findFirst();
        }

        if ("profesor".equalsIgnoreCase(usuario) || "docente".equalsIgnoreCase(usuario)) {
            return usuarioRepository.findByRol("DOCENTE").stream().findFirst();
        }

        return usuarioRepository.findByEmailAndActivo(usuario, true);
    }

    private String normalizarRol(String rol) {
        if ("ADMIN".equalsIgnoreCase(rol)) {
            return "admin";
        }
        if ("DOCENTE".equalsIgnoreCase(rol) || "PROFESOR".equalsIgnoreCase(rol)) {
            return "profesor";
        }
        if ("COORDINADOR".equalsIgnoreCase(rol)) {
            return "coordinador";
        }
        return rol.toLowerCase();
    }
}
