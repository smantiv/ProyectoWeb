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
import java.util.List;
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
        crearDatosDemoPersona2();
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

    private void crearDatosDemoPersona2() {
        Docente docente = obtenerDocenteDemoPersona2();
        List<Zona> zonas = zonaRepository.findAll();
        if (zonas.isEmpty()) {
            zonas = List.of(crearZonaSiNoExiste("Zona Demo Persona 2", "Zona para demo del flujo docente"));
        }

        LocalDate hoy = LocalDate.now();
        LocalDateTime ahora = LocalDateTime.now();
        LocalTime base = ahora.toLocalTime().withSecond(0).withNano(0);

        Turno pendiente = asegurarTurnoDemo("DEMO_PERSONA2_PENDIENTE", zonas.get(0 % zonas.size()), hoy, base.plusMinutes(20), base.plusMinutes(50));
        asegurarAsignacionDemo(docente, pendiente, "pendiente", null, null, null);

        Turno porIniciar = asegurarTurnoDemo("DEMO_PERSONA2_POR_INICIAR", zonas.get(1 % zonas.size()), hoy, base.plusMinutes(7), base.plusMinutes(37));
        asegurarAsignacionDemo(docente, porIniciar, "pendiente", null, null, null);

        Turno checkinDemo = asegurarTurnoDemo("DEMO_PERSONA2_CHECKIN", zonas.get(2 % zonas.size()), hoy, base.minusMinutes(1), base.plusMinutes(40));
        asegurarAsignacionDemo(docente, checkinDemo, "pendiente", null, null, null);

        Turno cerrable = asegurarTurnoDemo("DEMO_PERSONA2_CERRABLE", zonas.get(3 % zonas.size()), hoy, base.minusMinutes(12), base.plusMinutes(35));
        asegurarAsignacionDemo(docente, cerrable, "cubierta", ahora.minusMinutes(11), null, null);

        Turno confirmarRecorrido = asegurarTurnoDemo("DEMO_PERSONA2_CONFIRMAR_RECORRIDO", zonas.get(4 % zonas.size()), hoy, base.minusMinutes(20), base.plusMinutes(30));
        AsignacionTurno asignacionConfirmar = asegurarAsignacionDemo(docente, confirmarRecorrido, "cubierta", ahora.minusMinutes(20), null, null);
        asegurarRecorridoAntiguoDemo(asignacionConfirmar, ahora.minusMinutes(15));

        Turno reemplazo = asegurarTurnoDemo("DEMO_PERSONA2_REEMPLAZO", zonas.get(5 % zonas.size()), hoy, base.plusMinutes(60), base.plusMinutes(90));
        asegurarAsignacionDemo(docente, reemplazo, "pendiente", null, null, null);
    }

    private Docente obtenerDocenteDemoPersona2() {
        Optional<Usuario> juan = usuarioRepository.findByEmail("juan@test.com");
        if (juan.isPresent()) {
            Optional<Docente> docente = docenteRepository.findByUsuarioId(juan.get().getId());
            if (docente.isPresent()) {
                return docente.get();
            }
        }

        List<Docente> docentes = docenteRepository.findAll();
        if (!docentes.isEmpty()) {
            return docentes.get(0);
        }

        Usuario usuario = crearUsuarioSiNoExiste("Juan Perez", "juan@test.com", "1234", "DOCENTE", true);
        return crearDocenteSiNoExiste("DOC001", usuario);
    }

    private Turno asegurarTurnoDemo(String marcadorEstado, Zona zona, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin) {
        Turno turno = turnoRepository.findByEstado(marcadorEstado).stream().findFirst().orElseGet(Turno::new);
        turno.setFecha(fecha);
        turno.setHoraInicio(horaInicio);
        turno.setHoraFin(horaFin);
        turno.setEstado(marcadorEstado);
        turno.setZona(zona);
        return turnoRepository.save(turno);
    }

    private AsignacionTurno asegurarAsignacionDemo(
            Docente docente,
            Turno turno,
            String estadoCobertura,
            LocalDateTime horaCheckin,
            LocalDateTime horaCierre,
            Integer calificacionLimpieza) {
        AsignacionTurno asignacion = asignacionTurnoRepository
                .findByDocenteIdAndTurnoId(docente.getId(), turno.getId())
                .orElseGet(AsignacionTurno::new);
        asignacion.setDocente(docente);
        asignacion.setTurno(turno);
        asignacion.setEstadoCobertura(estadoCobertura);
        asignacion.setHoraCheckin(horaCheckin);
        asignacion.setHoraCierre(horaCierre);
        asignacion.setCalificacionLimpieza(calificacionLimpieza);
        return asignacionTurnoRepository.save(asignacion);
    }

    private void asegurarRecorridoAntiguoDemo(AsignacionTurno asignacion, LocalDateTime fechaHora) {
        Checkpoint checkpoint = crearCheckpointSiNoExiste("Checkpoint Demo Persona 2");
        List<Recorrido> recorridos = recorridoRepository.findByAsignacionTurnoId(asignacion.getId());
        Recorrido recorrido = recorridos.isEmpty() ? new Recorrido() : recorridos.get(0);
        recorrido.setAsignacionTurno(asignacion);
        recorrido.setCheckpoint(checkpoint);
        recorrido.setFechaHora(fechaHora);
        recorridoRepository.save(recorrido);
    }
}
