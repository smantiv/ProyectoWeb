package com.example.repositories;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.entities.AsignacionTurno;


@Repository
public interface AsignacionTurnoRepository extends JpaRepository<AsignacionTurno, Long> {

    List<AsignacionTurno> findByDocenteId(Long docenteId);
}