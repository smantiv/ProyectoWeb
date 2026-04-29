package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.RecorridoDTO;
import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Checkpoint;
import com.example.sistema_turnos.entities.Recorrido;
import com.example.sistema_turnos.repositories.AsignacionTurnoRepository;
import com.example.sistema_turnos.repositories.CheckpointRepository;
import com.example.sistema_turnos.repositories.RecorridoRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public RecorridoDTO crearRecorrido(RecorridoDTO recorridoDTO) {
        Recorrido recorrido = new Recorrido();
        recorrido.setFechaHora(
                recorridoDTO.getFechaHora() != null
                        ? recorridoDTO.getFechaHora()
                        : LocalDateTime.now()
        );

        if (recorridoDTO.getCheckpointId() != null) {
            Optional<Checkpoint> checkpoint = checkpointRepository.findById(recorridoDTO.getCheckpointId());
            checkpoint.ifPresent(recorrido::setCheckpoint);
        }

        if (recorridoDTO.getAsignacionId() != null) {
            Optional<AsignacionTurno> asignacion = asignacionTurnoRepository.findById(recorridoDTO.getAsignacionId());
            asignacion.ifPresent(recorrido::setAsignacionTurno);
        }

        Recorrido recorridoGuardado = recorridoRepository.save(recorrido);
        return convertToDTO(recorridoGuardado);
    }

    public RecorridoDTO obtenerRecorridoPorId(Long id) {
        Optional<Recorrido> recorrido = recorridoRepository.findById(id);
        return recorrido.map(this::convertToDTO).orElse(null);
    }

    public List<RecorridoDTO> obtenerRecorridosPorAsignacion(Long asignacionId) {
        return recorridoRepository.findByAsignacionTurnoId(asignacionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RecorridoDTO> obtenerRecorridosPorCheckpoint(Long checkpointId) {
        return recorridoRepository.findByCheckpointId(checkpointId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RecorridoDTO> obtenerTodosLosRecorridos() {
        return recorridoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RecorridoDTO actualizarRecorrido(Long id, RecorridoDTO recorridoDTO) {
        Optional<Recorrido> recorridoExistente = recorridoRepository.findById(id);
        if (recorridoExistente.isPresent()) {
            Recorrido recorrido = recorridoExistente.get();
            recorrido.setFechaHora(recorridoDTO.getFechaHora());

            if (recorridoDTO.getCheckpointId() != null) {
                Optional<Checkpoint> checkpoint = checkpointRepository.findById(recorridoDTO.getCheckpointId());
                checkpoint.ifPresent(recorrido::setCheckpoint);
            }

            if (recorridoDTO.getAsignacionId() != null) {
                Optional<AsignacionTurno> asignacion = asignacionTurnoRepository.findById(recorridoDTO.getAsignacionId());
                asignacion.ifPresent(recorrido::setAsignacionTurno);
            }

            Recorrido recorridoActualizado = recorridoRepository.save(recorrido);
            return convertToDTO(recorridoActualizado);
        }
        return null;
    }

    public boolean eliminarRecorrido(Long id) {
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
