package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.UsuarioDTO;
import com.example.sistema_turnos.entities.Usuario;
import com.example.sistema_turnos.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioDTO crearUsuario(@NonNull UsuarioDTO usuarioDTO) {
        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setPassword(usuarioDTO.getPassword());
        usuario.setRol(usuarioDTO.getRol());
        usuario.setActivo(usuarioDTO.getActivo() != null ? usuarioDTO.getActivo() : true);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return convertToDTO(usuarioGuardado);
    }

    public UsuarioDTO obtenerUsuarioPorId(@NonNull Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(this::convertToDTO).orElse(null);
    }

    public UsuarioDTO obtenerUsuarioPorEmail(@NonNull String email) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        return usuario.map(this::convertToDTO).orElse(null);
    }

    public List<UsuarioDTO> obtenerTodoLosUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UsuarioDTO> obtenerUsuariosPorRol(@NonNull String rol) {
        return usuarioRepository.findByRol(rol).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO actualizarUsuario(@NonNull Long id, @NonNull UsuarioDTO usuarioDTO) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        if (usuarioExistente.isPresent()) {
            Usuario usuario = usuarioExistente.get();
            usuario.setNombre(usuarioDTO.getNombre());
            usuario.setEmail(usuarioDTO.getEmail());
            if (usuarioDTO.getPassword() != null && !usuarioDTO.getPassword().isEmpty()) {
                usuario.setPassword(usuarioDTO.getPassword());
            }
            usuario.setRol(usuarioDTO.getRol());
            usuario.setActivo(usuarioDTO.getActivo());

            Usuario usuarioActualizado = usuarioRepository.save(usuario);
            return convertToDTO(usuarioActualizado);
        }
        return null;
    }

    public boolean eliminarUsuario(@NonNull Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getActivo()
        );
    }
}
