package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.Recorrido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecorridoRepository extends JpaRepository<Recorrido, Long> {

    List<Recorrido> findByAsignacionTurnoId(Long asignacionId);

    List<Recorrido> findByCheckpointId(Long checkpointId);

    List<Recorrido> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Recorrido> findByAsignacionTurnoIdAndFechaHoraBetween(
            Long asignacionId,
            LocalDateTime inicio,
            LocalDateTime fin
    );
}