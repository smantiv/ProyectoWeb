package com.example.sistema_turnos.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

@GetMapping("/")
public String index() {
    return "index";
}

@GetMapping("/templates/ejemplo-api.html")
public String ejemploApi() {
    return "ejemplo-api";
}

@GetMapping("/templates/dashboard-profesor.html")
public String dashboardProfesor() {
    return "dashboard-profesor";
}

@GetMapping("/templates/dashboard-coordinador.html")
public String dashboardCordinador() {
    return "dashboard-coordinador";
}

@GetMapping("/templates/dashboard-admin.html")
public String dashboardAdmin() {
    return "dashboard-admin";
    }
}