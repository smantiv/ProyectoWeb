package com.example.sistema_turnos.services;

import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.security.AuthUserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    private final CurrentDocenteContextService currentDocenteContextService;

    public AuthorizationService(CurrentDocenteContextService currentDocenteContextService) {
        this.currentDocenteContextService = currentDocenteContextService;
    }

    public void validarAccesoDocenteAAsignacion(AsignacionTurno asignacion) {
        if (!esDocente()) {
            return;
        }

        Long docenteActualId = currentDocenteContextService.obtenerDocenteActualId();
        Long docenteAsignadoId = asignacion.getDocente() != null ? asignacion.getDocente().getId() : null;
        if (!docenteActualId.equals(docenteAsignadoId)) {
            throw new AccessDeniedException("No puedes operar sobre una asignacion de otro docente");
        }
    }

    public String obtenerNombreUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof AuthUserPrincipal principal) {
            return principal.getNombre();
        }
        return "Sistema";
    }

    private boolean esDocente() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthUserPrincipal principal)) {
            return false;
        }
        return "DOCENTE".equals(principal.getRol());
    }
}
