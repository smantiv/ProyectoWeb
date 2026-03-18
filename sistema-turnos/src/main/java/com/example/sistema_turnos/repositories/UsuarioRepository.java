package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByRol(String rol);

    List<Usuario> findByActivo(Boolean activo);

    Optional<Usuario> findByEmailAndActivo(String email, Boolean activo);
}