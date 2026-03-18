package com.example.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.entities.Checkpoint;


@Repository
public interface CheckpointRepository extends JpaRepository<Checkpoint, Long> {
}
