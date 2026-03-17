package com.example.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TurnoController {

    @GetMapping("/turnos")
    public String gestionTurnos() {
        return "gestion-turnos";
    }
}