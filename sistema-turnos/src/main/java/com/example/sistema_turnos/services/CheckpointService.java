package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.CheckpointDTO;
import com.example.sistema_turnos.entities.Checkpoint;
import com.example.sistema_turnos.repositories.CheckpointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CheckpointService {

    @Autowired
    private CheckpointRepository checkpointRepository;

    public CheckpointDTO crearCheckpoint(@NonNull CheckpointDTO checkpointDTO) {
        Checkpoint checkpoint = new Checkpoint();
        checkpoint.setNombre(checkpointDTO.getNombre());

        Checkpoint checkpointGuardado = checkpointRepository.save(checkpoint);
        return convertToDTO(checkpointGuardado);
    }

    public CheckpointDTO obtenerCheckpointPorId(@NonNull Long id) {
        Optional<Checkpoint> checkpoint = checkpointRepository.findById(id);
        return checkpoint.map(this::convertToDTO).orElse(null);
    }

    public CheckpointDTO obtenerCheckpointPorNombre(@NonNull String nombre) {
        Optional<Checkpoint> checkpoint = checkpointRepository.findByNombre(nombre);
        return checkpoint.map(this::convertToDTO).orElse(null);
    }

    public List<CheckpointDTO> obtenerTodosLosCheckpoints() {
        return checkpointRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CheckpointDTO actualizarCheckpoint(@NonNull Long id, @NonNull CheckpointDTO checkpointDTO) {
        Optional<Checkpoint> checkpointExistente = checkpointRepository.findById(id);
        if (checkpointExistente.isPresent()) {
            Checkpoint checkpoint = checkpointExistente.get();
            checkpoint.setNombre(checkpointDTO.getNombre());

            Checkpoint checkpointActualizado = checkpointRepository.save(checkpoint);
            return convertToDTO(checkpointActualizado);
        }
        return null;
    }

    public boolean eliminarCheckpoint(@NonNull Long id) {
        if (checkpointRepository.existsById(id)) {
            checkpointRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private CheckpointDTO convertToDTO(Checkpoint checkpoint) {
        return new CheckpointDTO(checkpoint.getId(), checkpoint.getNombre());
    }
}
