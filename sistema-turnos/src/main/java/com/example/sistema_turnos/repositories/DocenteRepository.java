package com.example.sistema_turnos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sistema_turnos.entities.Docente;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {
}
