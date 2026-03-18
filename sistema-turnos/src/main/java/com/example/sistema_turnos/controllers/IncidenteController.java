package com.example.sistema_turnos.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IncidenteController {

    @GetMapping("/incidentes/reportar")
    public String registroIncidente() {
        return "registro-incidente";
    }
}