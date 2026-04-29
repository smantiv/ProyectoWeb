package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.RecorridoDTO;
import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Checkpoint;
import com.example.sistema_turnos.entities.Recorrido;
import com.example.sistema_turnos.repositories.AsignacionTurnoRepository;
import com.example.sistema_turnos.repositories.CheckpointRepository;
import com.example.sistema_turnos.repositories.RecorridoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecorridoService {

    @Autowired
    private RecorridoRepository recorridoRepository;

    @Autowired
    private CheckpointRepository checkpointRepository;

    @Autowired
    private AsignacionTurnoRepository asignacionTurnoRepository;

    public RecorridoDTO crearRecorrido(@NonNull RecorridoDTO recorridoDTO) {
        Recorrido recorrido = new Recorrido();
        recorrido.setFechaHora(
                recorridoDTO.getFechaHora() != null
                        ? recorridoDTO.getFechaHora()
                        : LocalDateTime.now()
        );

        Long checkpointId = recorridoDTO.getCheckpointId();
        if (checkpointId != null) {
            Optional<Checkpoint> checkpoint = checkpointRepository.findById(checkpointId);
            checkpoint.ifPresent(recorrido::setCheckpoint);
        }

        Long asignacionId = recorridoDTO.getAsignacionId();
        if (asignacionId != null) {
            Optional<AsignacionTurno> asignacion = asignacionTurnoRepository.findById(asignacionId);
            asignacion.ifPresent(recorrido::setAsignacionTurno);
        }

        Recorrido recorridoGuardado = recorridoRepository.save(recorrido);
        return convertToDTO(recorridoGuardado);
    }

    public RecorridoDTO obtenerRecorridoPorId(@NonNull Long id) {
        Optional<Recorrido> recorrido = recorridoRepository.findById(id);
        return recorrido.map(this::convertToDTO).orElse(null);
    }

    public List<RecorridoDTO> obtenerRecorridosPorAsignacion(@NonNull Long asignacionId) {
        return recorridoRepository.findByAsignacionTurnoId(asignacionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RecorridoDTO> obtenerRecorridosPorCheckpoint(@NonNull Long checkpointId) {
        return recorridoRepository.findByCheckpointId(checkpointId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RecorridoDTO> obtenerTodosLosRecorridos() {
        return recorridoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RecorridoDTO actualizarRecorrido(@NonNull Long id, @NonNull RecorridoDTO recorridoDTO) {
        Optional<Recorrido> recorridoExistente = recorridoRepository.findById(id);
        if (recorridoExistente.isPresent()) {
            Recorrido recorrido = recorridoExistente.get();
            recorrido.setFechaHora(recorridoDTO.getFechaHora());

            Long checkpointId = recorridoDTO.getCheckpointId();
            if (checkpointId != null) {
                Optional<Checkpoint> checkpoint = checkpointRepository.findById(checkpointId);
                checkpoint.ifPresent(recorrido::setCheckpoint);
            }

            Long asignacionId = recorridoDTO.getAsignacionId();
            if (asignacionId != null) {
                Optional<AsignacionTurno> asignacion = asignacionTurnoRepository.findById(asignacionId);
                asignacion.ifPresent(recorrido::setAsignacionTurno);
            }

            Recorrido recorridoActualizado = recorridoRepository.save(recorrido);
            return convertToDTO(recorridoActualizado);
        }
        return null;
    }

    public boolean eliminarRecorrido(@NonNull Long id) {
        if (recorridoRepository.existsById(id)) {
            recorridoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private RecorridoDTO convertToDTO(Recorrido recorrido) {
        Long checkpointId = recorrido.getCheckpoint() != null ? recorrido.getCheckpoint().getId() : null;
        Long asignacionId = recorrido.getAsignacionTurno() != null ? recorrido.getAsignacionTurno().getId() : null;
        return new RecorridoDTO(
                recorrido.getId(),
                recorrido.getFechaHora(),
                checkpointId,
                asignacionId
        );
    }
}
