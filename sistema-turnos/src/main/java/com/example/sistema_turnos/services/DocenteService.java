package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.DocenteDTO;
import com.example.sistema_turnos.dtos.DocenteActualDTO;
import com.example.sistema_turnos.dtos.UsuarioDTO;
import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.entities.Usuario;
import com.example.sistema_turnos.repositories.DocenteRepository;
import com.example.sistema_turnos.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DocenteService {

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CurrentDocenteContextService currentDocenteContextService;

    public DocenteDTO crearDocente(DocenteDTO docenteDTO) {
        Docente docente = new Docente();
        docente.setCodigoInstitucional(docenteDTO.getCodigoInstitucional());

        if (docenteDTO.getUsuario() != null && docenteDTO.getUsuario().getId() != null) {
            Optional<Usuario> usuario = usuarioRepository.findById(docenteDTO.getUsuario().getId());
            usuario.ifPresent(docente::setUsuario);
        }

        Docente docenteGuardado = docenteRepository.save(docente);
        return convertToDTO(docenteGuardado);
    }

    public DocenteDTO obtenerDocentePorId(Long id) {
        Optional<Docente> docente = docenteRepository.findById(id);
        return docente.map(this::convertToDTO).orElse(null);
    }

    public DocenteDTO obtenerDocentePorCodigoInstitucional(String codigo) {
        Optional<Docente> docente = docenteRepository.findByCodigoInstitucional(codigo);
        return docente.map(this::convertToDTO).orElse(null);
    }

    public DocenteDTO obtenerDocentePorUsuarioId(Long usuarioId) {
        Optional<Docente> docente = docenteRepository.findByUsuarioId(usuarioId);
        return docente.map(this::convertToDTO).orElse(null);
    }

    public List<DocenteDTO> obtenerTodosLosDocentes() {
        return docenteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DocenteActualDTO obtenerDocenteActual() {
        Docente docente = currentDocenteContextService.obtenerDocenteActual();
        String nombre = docente.getUsuario() != null ? docente.getUsuario().getNombre() : docente.getCodigoInstitucional();
        return new DocenteActualDTO(docente.getId(), nombre, docente.getCodigoInstitucional());
    }

    public DocenteDTO actualizarDocente(Long id, DocenteDTO docenteDTO) {
        Optional<Docente> docenteExistente = docenteRepository.findById(id);
        if (docenteExistente.isPresent()) {
            Docente docente = docenteExistente.get();
            docente.setCodigoInstitucional(docenteDTO.getCodigoInstitucional());

            if (docenteDTO.getUsuario() != null && docenteDTO.getUsuario().getId() != null) {
                Optional<Usuario> usuario = usuarioRepository.findById(docenteDTO.getUsuario().getId());
                usuario.ifPresent(docente::setUsuario);
            }

            Docente docenteActualizado = docenteRepository.save(docente);
            return convertToDTO(docenteActualizado);
        }
        return null;
    }

    public boolean eliminarDocente(Long id) {
        if (docenteRepository.existsById(id)) {
            docenteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private DocenteDTO convertToDTO(Docente docente) {
        UsuarioDTO usuarioDTO = null;
        if (docente.getUsuario() != null) {
            usuarioDTO = new UsuarioDTO(
                    docente.getUsuario().getId(),
                    docente.getUsuario().getNombre(),
                    docente.getUsuario().getEmail(),
                    docente.getUsuario().getRol(),
                    docente.getUsuario().getActivo()
            );
        }
        return new DocenteDTO(docente.getId(), docente.getCodigoInstitucional(), usuarioDTO);
    }
}
