package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.Reasignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReasignacionRepository extends JpaRepository<Reasignacion, Long> {

    List<Reasignacion> findByDocenteId(Long docenteId);

    List<Reasignacion> findByEstado(String estado);

    List<Reasignacion> findByDocenteIdAndEstado(Long docenteId, String estado);

    List<Reasignacion> findByTurnoId(Long turnoId);

    List<Reasignacion> findByTurnoIdAndEstado(Long turnoId, String estado);
}