package com.example.sistema_turnos.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @PostMapping("/auth/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        response.put("token", "jwt-token-123");
        response.put("user", Map.of(
            "id", 1,
            "nombre", "Juan García",
            "email", credentials.get("email"),
            "rol", "profesor"
        ));
        return response;
    }

    @GetMapping("/turnos")
    public java.util.List<Map<String, Object>> getTurnos() {
        return java.util.List.of(
            Map.of("id", 1, "fecha", "2024-01-15", "horaInicio", "07:00", "horaFin", "09:00", "zona", "Entrada Principal", "estado", "Asignado"),
            Map.of("id", 2, "fecha", "2024-01-16", "horaInicio", "09:00", "horaFin", "11:00", "zona", "Pasillo Central", "estado", "Asignado")
        );
    }

    @PostMapping("/contacto")
    public Map<String, String> contacto(@RequestBody Map<String, String> data) {
        return Map.of("mensaje", "Mensaje enviado exitosamente");
    }
}
