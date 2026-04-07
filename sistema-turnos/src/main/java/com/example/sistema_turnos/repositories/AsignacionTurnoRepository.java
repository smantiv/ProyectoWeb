package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.AsignacionTurno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsignacionTurnoRepository extends JpaRepository<AsignacionTurno, Long> {

    List<AsignacionTurno> findByDocenteId(Long docenteId);

    List<AsignacionTurno> findByTurnoId(Long turnoId);

    List<AsignacionTurno> findByEstadoCobertura(String estadoCobertura);

    Optional<AsignacionTurno> findByDocenteIdAndTurnoId(Long docenteId, Long turnoId);

    List<AsignacionTurno> findByHoraCheckinBetween(LocalDateTime inicio, LocalDateTime fin);

    List<AsignacionTurno> findByDocenteIdAndHoraCheckinBetween(
            Long docenteId,
            LocalDateTime inicio,
            LocalDateTime fin
    );

    List<AsignacionTurno> findByEstadoCoberturaOrderByHoraCheckinDesc(String estadoCobertura);
}