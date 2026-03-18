package com.example.sistema_turnos.repositories;

import com.example.sistema_turnos.entities.Checkpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CheckpointRepository extends JpaRepository<Checkpoint, Long> {

    Optional<Checkpoint> findByNombre(String nombre);

}