package com.example.sistema_turnos.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProfesorController {

    @GetMapping("/profesores")
    public String gestionProfesores() {
        return "gestion-profesores";
    }
}