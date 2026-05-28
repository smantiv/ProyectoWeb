package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.LoginResponseDTO;
import com.example.sistema_turnos.dtos.UsuarioDTO;
import com.example.sistema_turnos.entities.Usuario;
import com.example.sistema_turnos.repositories.UsuarioRepository;
import com.example.sistema_turnos.security.AuthUserPrincipal;
import com.example.sistema_turnos.security.TokenService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public LoginResponseDTO login(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Correo o password invalidos"));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new BadCredentialsException("El usuario esta inactivo");
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new BadCredentialsException("Correo o password invalidos");
        }

        return new LoginResponseDTO(tokenService.generarToken(usuario), toDTO(usuario));
    }

    public UsuarioDTO me(AuthUserPrincipal principal) {
        Usuario usuario = usuarioRepository.findById(principal.getId())
                .orElseThrow(() -> new BadCredentialsException("Usuario inexistente"));
        return toDTO(usuario);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getActivo()
        );
    }
}
