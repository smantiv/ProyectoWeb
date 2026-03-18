package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.Zona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZonaRepository extends JpaRepository<Zona, Long> {

    Optional<Zona> findByNombre(String nombre);

}