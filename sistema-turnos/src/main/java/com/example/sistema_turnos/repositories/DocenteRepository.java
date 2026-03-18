package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {

    Optional<Docente> findByUsuarioId(Long usuarioId);

    Optional<Docente> findByCodigoInstitucional(String codigoInstitucional);

}