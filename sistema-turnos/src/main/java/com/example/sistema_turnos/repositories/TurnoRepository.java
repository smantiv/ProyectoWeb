package com.example.sistema_turnos.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sistema_turnos.entities.Turno;

import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    List<Turno> findByDocenteId(Long docenteId);

    List<Turno> findByZonaId(Long zonaId);
}