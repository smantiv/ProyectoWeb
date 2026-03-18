package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.Incidente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidenteRepository extends JpaRepository<Incidente, Long> {

    List<Incidente> findByAsignacionTurnoId(Long asignacionId);

    List<Incidente> findByTipo(String tipo);

    List<Incidente> findBySeveridad(String severidad);

    List<Incidente> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Incidente> findByAsignacionTurnoIdAndFechaHoraBetween(
            Long asignacionId,
            LocalDateTime inicio,
            LocalDateTime fin
    );
}