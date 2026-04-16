package com.example.sistema_turnos.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador para servir la SPA (Single Page Application)
 * Todas las rutas se sirven desde index.html y Vue Router maneja la navegación
 */
@Controller
public class PantallaController {

    /**
     * Ruta raíz - Sirve la SPA
     */
    @GetMapping("/")
    public String index() {
        return "index";
    }

    /**
     * Captura todas las rutas desconocidas y las redirige a index
     * (forward, no redirect - mantiene la URL en la barra de direcciones)
     */
    @GetMapping("/**")
    public String catchAll() {
        return "forward:/";
    }
}
