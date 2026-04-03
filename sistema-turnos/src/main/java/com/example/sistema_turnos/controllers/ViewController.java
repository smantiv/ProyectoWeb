package com.example.sistema_turnos.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador MVC para renderizar vistas HTML.
 * Solo maneja GET mappings para pantallas de inicio y dashboards.
 */
@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/ejemplo-api")
    public String ejemploApi() {
        return "ejemplo-api";
    }

    @GetMapping("/dashboard-profesor")
    public String dashboardProfesor() {
        return "dashboard-profesor";
    }

    @GetMapping("/dashboard-coordinador")
    public String dashboardCordinador() {
        return "dashboard-coordinador";
    }

    @GetMapping("/dashboard-admin")
    public String dashboardAdmin() {
        return "dashboard-admin";
    }
}