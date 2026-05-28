package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.LoginRequestDTO;
import com.example.sistema_turnos.dtos.LoginResponseDTO;
import com.example.sistema_turnos.dtos.UsuarioDTO;
import com.example.sistema_turnos.security.AuthUserPrincipal;
import com.example.sistema_turnos.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthRestController {

    private final AuthService authService;

    public AuthRestController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request.getEmail(), request.getPassword()));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> me(@AuthenticationPrincipal AuthUserPrincipal principal) {
        return ResponseEntity.ok(authService.me(principal));
    }
}
