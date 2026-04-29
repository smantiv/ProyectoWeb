package com.example.sistema_turnos.controllers;

import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.services.CurrentDocenteContextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class CurrentDocenteViewAdvice {

    @Autowired
    private CurrentDocenteContextService currentDocenteContextService;

    @ModelAttribute("currentDocenteId")
    public Long currentDocenteId() {
        return currentDocenteContextService.obtenerDocenteActualOptional()
                .map(Docente::getId)
                .orElse(null);
    }

    @ModelAttribute("currentDocenteNombre")
    public String currentDocenteNombre() {
        return currentDocenteContextService.obtenerDocenteActualOptional()
                .map(Docente::getUsuario)
                .map(usuario -> usuario.getNombre())
                .orElse("Docente");
    }
}
