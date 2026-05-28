package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.RecorridoDTO;
import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Checkpoint;
import com.example.sistema_turnos.entities.Recorrido;
import com.example.sistema_turnos.entities.Turno;
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

    @Autowired
    private AuthorizationService authorizationService;

    public RecorridoDTO crearRecorrido(@NonNull RecorridoDTO recorridoDTO) {
        Long checkpointId = recorridoDTO.getCheckpointId();
        if (checkpointId == null) {
            throw new IllegalArgumentException("El checkpointId es obligatorio.");
        }

        Checkpoint checkpoint = checkpointRepository.findById(checkpointId)
                .orElseThrow(() -> new IllegalArgumentException("Checkpoint no encontrado."));

        Long asignacionId = recorridoDTO.getAsignacionId();
        if (asignacionId == null) {
            throw new IllegalArgumentException("El asignacionId es obligatorio.");
        }

        AsignacionTurno asignacion = asignacionTurnoRepository.findById(asignacionId)
                .orElseThrow(() -> new IllegalArgumentException("Asignacion no encontrada."));

        authorizationService.validarAccesoDocenteAAsignacion(asignacion);
        validarAsignacionEnCurso(asignacion);
        validarPin(checkpointId, recorridoDTO.getPin());

        Recorrido recorrido = new Recorrido();
        recorrido.setFechaHora(
                recorridoDTO.getFechaHora() != null
                        ? recorridoDTO.getFechaHora()
                        : LocalDateTime.now()
        );
        recorrido.setCheckpoint(checkpoint);
        recorrido.setAsignacionTurno(asignacion);

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

    private void validarAsignacionEnCurso(AsignacionTurno asignacion) {
        if (asignacion.getHoraCheckin() == null) {
            throw new IllegalStateException("La asignacion debe tener check-in antes de registrar recorrido.");
        }

        if (asignacion.getHoraCierre() != null) {
            throw new IllegalStateException("La asignacion ya esta cerrada.");
        }

        Turno turno = asignacion.getTurno();
        if (turno == null || turno.getFecha() == null || turno.getHoraFin() == null) {
            throw new IllegalStateException("La asignacion no tiene un turno valido.");
        }

        if (!LocalDateTime.now().isBefore(LocalDateTime.of(turno.getFecha(), turno.getHoraFin()))) {
            throw new IllegalStateException("El turno ya finalizo. No se puede registrar recorrido.");
        }
    }

    private void validarPin(Long checkpointId, String pin) {
        String pinIngresado = pin != null ? pin.trim() : "";
        if (pinIngresado.isEmpty()) {
            throw new IllegalArgumentException("El PIN del checkpoint es obligatorio.");
        }

        long ventanaActual = System.currentTimeMillis() / 30000;
        String pinEsperado = generarPinDinamico(checkpointId, ventanaActual);
        String pinVentanaAnterior = generarPinDinamico(checkpointId, ventanaActual - 1);
        if (!pinEsperado.equals(pinIngresado) && !pinVentanaAnterior.equals(pinIngresado)) {
            throw new IllegalArgumentException("PIN invalido para el checkpoint enviado.");
        }
    }

    private String generarPinDinamico(Long checkpointId, long windowSlot) {
        long seed = (checkpointId * 7919L) + (windowSlot * 104729L);
        return String.valueOf(Math.abs(seed % 9000) + 1000).substring(0, 4);
    }
}
