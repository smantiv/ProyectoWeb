package com.example.sistema_turnos.services;

import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.exceptions.ResourceNotFoundException;
import com.example.sistema_turnos.repositories.DocenteRepository;
import com.example.sistema_turnos.security.AuthUserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CurrentDocenteContextService {

    @Autowired
    private DocenteRepository docenteRepository;

    public Optional<Docente> obtenerDocenteActualOptional() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthUserPrincipal principal)) {
            return Optional.empty();
        }
        return docenteRepository.findByUsuarioId(principal.getId());
    }

    public Docente obtenerDocenteActual() {
        return obtenerDocenteActualOptional()
                .orElseThrow(() -> new ResourceNotFoundException("El usuario autenticado no tiene docente asociado"));
    }

    public Long obtenerDocenteActualId() {
        return obtenerDocenteActual().getId();
    }
}
