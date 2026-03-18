package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    List<Turno> findByFecha(LocalDate fecha);

    List<Turno> findByEstado(String estado);

    List<Turno> findByZonaId(Long zonaId);

    List<Turno> findByFechaAndEstado(LocalDate fecha, String estado);
}