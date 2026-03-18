package com.example.sistema_turnos.repositories;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sistema_turnos.entities.Incidente;


@Repository
public interface IncidenteRepository extends JpaRepository<Incidente, Long> {

    List<Incidente> findByZonaId(Long zonaId);

    List<Incidente> findByFecha(LocalDate fecha);
}