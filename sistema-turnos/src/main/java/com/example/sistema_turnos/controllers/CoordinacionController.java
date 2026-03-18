package com.example.sistema_turnos.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CoordinacionController {

    @GetMapping("/coordinacion")
    public String tableroCoordinacion() {
        return "tablero-coordinacion";
    }
}