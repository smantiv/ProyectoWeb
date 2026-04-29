package com.example.sistema_turnos.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Sirve la SPA de React compilada para cualquier ruta del frontend.
 */
@Controller
public class PantallaController {

    @GetMapping(value = {"/", "/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String index() {
        return "forward:/react-build/index.html";
    }
}
