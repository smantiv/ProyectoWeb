package com.example.sistema_turnos.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador MVC para renderizar vistas adicionales del sistema.
 * Maneja rutas para pantallas de gestión, reportes, perfiles y soporte.
 */
@Controller
public class PantallaController {

    // ========== RUTAS DE GESTIÓN ==========

    @GetMapping("/turnos")
    public String gestionTurnos() {
        return "gestion-turnos";
    }

    @GetMapping("/profesores")
    public String gestionProfesores() {
        return "gestion-profesores";
    }

    @GetMapping("/incidentes")
    public String gestionIncidentes() { 
        return "gestion-incidentes";
    }

    @GetMapping("/zonas")
    public String gestionZonas() {
        return "gestion-zonas";
    }

    @GetMapping("/tablero-coordinacion")
    public String tableroCoordinacion() {
        return "tablero-coordinacion";
    }

    // ========== RUTAS DE USUARIO ==========

    @GetMapping("/mis-turnos")
    public String misTurnos() {
        return "mis-turnos";
    }

    @GetMapping("/mi-perfil")
    public String miPerfil() {
        return "perfil-cuenta";
    }

    @GetMapping("/mi-perfil-profesor")
    public String miPerfilProfesor() {
        return "perfil-profesor";
    }

    @GetMapping("/mi-perfil-coordinador")
    public String miPerfilCoordinador() {
        return "perfil-coordinador";
    }

    // ========== RUTAS DE ACCIONES RÁPIDAS ==========

    @GetMapping("/registrar-punto")
    public String registrarPunto() {
        return "registrar-punto";
    }

    @GetMapping("/reportar-incidente")
    public String reportarIncidente() {
        return "reportar-incidente";
    }

    @GetMapping("/solicitar-reemplazo")
    public String solicitarReemplazo() {
        return "solicitar-reemplazo";
    }

    // ========== RUTAS DE ANALÍTICAS Y REPORTES ==========

    @GetMapping("/analiticas")
    public String analiticas() {
        return "analiticas";
    }

    @GetMapping("/cobertura")
    public String coberturaTiempoReal() {
        return "cobertura-tiempo-real";
    }

    @GetMapping("/metricas-docentes")
    public String metricasPositivasDocentes() {
        return "MetricasPositivasDocentes";
    }

    @GetMapping("/reconocimientos")
    public String reconocimientosInstitucionales() {
        return "reconocimientos-institucionales";
    }

    // ========== RUTAS DE INFORMACIÓN ==========

    @GetMapping("/reglas-operativas")
    public String reglasOperativas() {
        return "reglas-operativas";
    }

    @GetMapping("/soporte")
    public String soporte() {
        return "soporte";
    }

    @GetMapping("/contacto")
    public String contacto() {
        return "contacto";
    }
}
