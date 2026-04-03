package com.example.sistema_turnos.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @Deprecated - Redundante. Usar PantallaController en su lugar.
 * Esta clase ya no se registra como controlador.
 */
// @Controller
public class ProfesorController {

    @GetMapping("/profesores")
    public String gestionProfesores() {
        return "gestion-profesores";
    }
}