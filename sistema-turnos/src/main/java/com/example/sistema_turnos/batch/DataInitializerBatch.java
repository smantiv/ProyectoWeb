package com.example.sistema_turnos.batch;

import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Checkpoint;
import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.entities.Incidente;
import com.example.sistema_turnos.entities.Recorrido;
import com.example.sistema_turnos.entities.Turno;
import com.example.sistema_turnos.entities.Usuario;
import com.example.sistema_turnos.entities.Zona;
import com.example.sistema_turnos.repositories.AsignacionTurnoRepository;
import com.example.sistema_turnos.repositories.CheckpointRepository;
import com.example.sistema_turnos.repositories.DocenteRepository;
import com.example.sistema_turnos.repositories.IncidenteRepository;
import com.example.sistema_turnos.repositories.RecorridoRepository;
import com.example.sistema_turnos.repositories.TurnoRepository;
import com.example.sistema_turnos.repositories.UsuarioRepository;
import com.example.sistema_turnos.repositories.ZonaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

@Component
public class DataInitializerBatch implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final DocenteRepository docenteRepository;
    private final ZonaRepository zonaRepository;
    private final TurnoRepository turnoRepository;
    private final AsignacionTurnoRepository asignacionTurnoRepository;
    private final CheckpointRepository checkpointRepository;
    private final RecorridoRepository recorridoRepository;
    private final IncidenteRepository incidenteRepository;

    public DataInitializerBatch(
            UsuarioRepository usuarioRepository,
            DocenteRepository docenteRepository,
            ZonaRepository zonaRepository,
            TurnoRepository turnoRepository,
            AsignacionTurnoRepository asignacionTurnoRepository,
            CheckpointRepository checkpointRepository,
            RecorridoRepository recorridoRepository,
            IncidenteRepository incidenteRepository) {
        this.usuarioRepository = usuarioRepository;
        this.docenteRepository = docenteRepository;
        this.zonaRepository = zonaRepository;
        this.turnoRepository = turnoRepository;
        this.asignacionTurnoRepository = asignacionTurnoRepository;
        this.checkpointRepository = checkpointRepository;
        this.recorridoRepository = recorridoRepository;
        this.incidenteRepository = incidenteRepository;
    }

    @Override
    public void run(String... args) {
        crearUsuarioSiNoExiste("Admin Sistema Batch", "admin.batch@test.com", "1234", "ADMIN", true);
        Usuario docenteUsuario = crearUsuarioSiNoExiste("Docente Batch", "docente.batch@test.com", "1234", "DOCENTE", true);

        Docente docente = crearDocenteSiNoExiste("DOCBATCH001", docenteUsuario);
        Zona zona = crearZonaSiNoExiste("Zona Batch", "Zona inicial creada desde CommandLineRunner");
        Turno turno = crearTurnoSiNoExistenTurnos(zona);
        AsignacionTurno asignacion = crearAsignacionSiNoExistenAsignaciones(docente, turno);
        Checkpoint checkpoint = crearCheckpointSiNoExiste("Checkpoint Batch");
        crearRecorridoSiNoExistenRecorridos(checkpoint, asignacion);
        crearIncidenteSiNoExistenIncidentes(asignacion);
    }

    private Usuario crearUsuarioSiNoExiste(String nombre, String email, String password, String rol, Boolean activo) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(email);
        if (existente.isPresent()) {
            return existente.get();
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPassword(password);
        usuario.setRol(rol);
        usuario.setActivo(activo);
        return usuarioRepository.save(usuario);
    }

    private Docente crearDocenteSiNoExiste(String codigoInstitucional, Usuario usuario) {
        Optional<Docente> existente = docenteRepository.findByCodigoInstitucional(codigoInstitucional);
        if (existente.isPresent()) {
            return existente.get();
        }

        Docente docente = new Docente();
        docente.setCodigoInstitucional(codigoInstitucional);
        docente.setUsuario(usuario);
        return docenteRepository.save(docente);
    }

    private Zona crearZonaSiNoExiste(String nombre, String descripcion) {
        Optional<Zona> existente = zonaRepository.findByNombre(nombre);
        if (existente.isPresent()) {
            return existente.get();
        }

        Zona zona = new Zona();
        zona.setNombre(nombre);
        zona.setDescripcion(descripcion);
        return zonaRepository.save(zona);
    }

    private Turno crearTurnoSiNoExistenTurnos(Zona zona) {
        if (turnoRepository.count() > 0) {
            return turnoRepository.findAll().get(0);
        }

        Turno turno = new Turno();
        turno.setFecha(LocalDate.of(2026, 4, 16));
        turno.setHoraInicio(LocalTime.of(7, 0));
        turno.setHoraFin(LocalTime.of(9, 0));
        turno.setEstado("PENDIENTE");
        turno.setZona(zona);
        return turnoRepository.save(turno);
    }

    private AsignacionTurno crearAsignacionSiNoExistenAsignaciones(Docente docente, Turno turno) {
        Optional<AsignacionTurno> existente = asignacionTurnoRepository.findByDocenteIdAndTurnoId(docente.getId(), turno.getId());
        if (existente.isPresent()) {
            return existente.get();
        }

        AsignacionTurno asignacion = new AsignacionTurno();
        asignacion.setDocente(docente);
        asignacion.setTurno(turno);
        asignacion.setEstadoCobertura("PENDIENTE");
        asignacion.setHoraCheckin(null);
        asignacion.setHoraCierre(null);
        asignacion.setCalificacionLimpieza(null);
        return asignacionTurnoRepository.save(asignacion);
    }

    private Checkpoint crearCheckpointSiNoExiste(String nombre) {
        Optional<Checkpoint> existente = checkpointRepository.findByNombre(nombre);
        if (existente.isPresent()) {
            return existente.get();
        }

        Checkpoint checkpoint = new Checkpoint();
        checkpoint.setNombre(nombre);
        return checkpointRepository.save(checkpoint);
    }

    private void crearRecorridoSiNoExistenRecorridos(Checkpoint checkpoint, AsignacionTurno asignacion) {
        if (recorridoRepository.count() > 0) {
            return;
        }

        Recorrido recorrido = new Recorrido();
        recorrido.setCheckpoint(checkpoint);
        recorrido.setAsignacionTurno(asignacion);
        recorrido.setFechaHora(LocalDateTime.of(2026, 4, 16, 7, 15));
        recorridoRepository.save(recorrido);
    }

    private void crearIncidenteSiNoExistenIncidentes(AsignacionTurno asignacion) {
        if (incidenteRepository.count() > 0) {
            return;
        }

        Incidente incidente = new Incidente();
        incidente.setTipo("OBSERVACION");
        incidente.setSeveridad("BAJA");
        incidente.setDescripcion("Incidente inicial cargado desde CommandLineRunner");
        incidente.setFechaHora(LocalDateTime.of(2026, 4, 16, 7, 30));
        incidente.setAsignacionTurno(asignacion);
        incidenteRepository.save(incidente);
    }
}
