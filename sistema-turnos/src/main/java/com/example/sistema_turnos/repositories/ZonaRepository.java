package com.example.sistema_turnos.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sistema_turnos.entities.Zona;

@Repository
public interface ZonaRepository extends JpaRepository<Zona, Long> {
}   