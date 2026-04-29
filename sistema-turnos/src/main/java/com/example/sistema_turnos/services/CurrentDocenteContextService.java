package com.example.sistema_turnos.services;

import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.exceptions.ResourceNotFoundException;
import com.example.sistema_turnos.repositories.DocenteRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class CurrentDocenteContextService {

    private static final String SESSION_DOCENTE_ID = "currentDocenteId";

    @Autowired
    private DocenteRepository docenteRepository;

    public Optional<Docente> obtenerDocenteActualOptional() {
        Optional<Long> docenteId = obtenerDocenteActualIdDesdeSesion();
        if (docenteId.isPresent()) {
            Optional<Docente> docente = docenteRepository.findById(Objects.requireNonNull(docenteId.get()));
            if (docente.isPresent()) {
                return docente;
            }
        }

        List<Docente> docentes = docenteRepository.findAll();
        if (docentes.isEmpty()) {
            return Optional.empty();
        }

        Docente docentePorDefecto = docentes.get(0);
        guardarDocenteActualEnSesion(docentePorDefecto.getId());
        return Optional.of(docentePorDefecto);
    }

    public Docente obtenerDocenteActual() {
        return obtenerDocenteActualOptional()
                .orElseThrow(() -> new ResourceNotFoundException("No hay un docente actual disponible en el contexto"));
    }

    public Long obtenerDocenteActualId() {
        return obtenerDocenteActual().getId();
    }

    private Optional<Long> obtenerDocenteActualIdDesdeSesion() {
        HttpSession session = obtenerSesion(false);
        if (session == null) {
            return Optional.empty();
        }

        Object value = session.getAttribute(SESSION_DOCENTE_ID);
        if (value instanceof Number number) {
            return Optional.of(number.longValue());
        }
        if (value instanceof String stringValue && !stringValue.isBlank()) {
            return Optional.of(Long.parseLong(stringValue));
        }
        return Optional.empty();
    }

    private void guardarDocenteActualEnSesion(Long docenteId) {
        HttpSession session = obtenerSesion(true);
        if (session != null) {
            session.setAttribute(SESSION_DOCENTE_ID, docenteId);
        }
    }

    private HttpSession obtenerSesion(boolean create) {
        RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
        if (!(attributes instanceof ServletRequestAttributes servletAttributes)) {
            return null;
        }

        HttpServletRequest request = servletAttributes.getRequest();
        return request != null ? request.getSession(create) : null;
    }
}
