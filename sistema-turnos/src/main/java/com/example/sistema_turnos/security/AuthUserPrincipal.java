package com.example.sistema_turnos.security;

import com.example.sistema_turnos.entities.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

public class AuthUserPrincipal {

    private final Long id;
    private final String nombre;
    private final String email;
    private final String rol;
    private final Boolean activo;

    public AuthUserPrincipal(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.email = usuario.getEmail();
        this.rol = normalizarRol(usuario.getRol());
        this.activo = usuario.getActivo();
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getRol() {
        return rol;
    }

    public Boolean getActivo() {
        return activo;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol));
    }

    private String normalizarRol(String value) {
        return value == null ? "" : value.trim().toUpperCase();
    }
}
