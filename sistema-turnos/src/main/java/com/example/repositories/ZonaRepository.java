package com.example.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.entities.Zona;

@Repository
public interface ZonaRepository extends JpaRepository<Zona, Long> {
}   