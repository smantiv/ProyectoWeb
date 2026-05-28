package com.example.sistema_turnos;

import com.example.sistema_turnos.entities.AsignacionTurno;
import com.example.sistema_turnos.entities.Checkpoint;
import com.example.sistema_turnos.entities.Docente;
import com.example.sistema_turnos.entities.Turno;
import com.example.sistema_turnos.entities.Usuario;
import com.example.sistema_turnos.entities.Zona;
import com.example.sistema_turnos.repositories.AsignacionTurnoRepository;
import com.example.sistema_turnos.repositories.CheckpointRepository;
import com.example.sistema_turnos.repositories.DocenteRepository;
import com.example.sistema_turnos.repositories.IncidenteRepository;
import com.example.sistema_turnos.repositories.ReasignacionRepository;
import com.example.sistema_turnos.repositories.RecorridoRepository;
import com.example.sistema_turnos.repositories.TurnoRepository;
import com.example.sistema_turnos.repositories.UsuarioRepository;
import com.example.sistema_turnos.repositories.ZonaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SistemaTurnosIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ZonaRepository zonaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private AsignacionTurnoRepository asignacionTurnoRepository;

    @Autowired
    private CheckpointRepository checkpointRepository;

    @Autowired
    private RecorridoRepository recorridoRepository;

    @Autowired
    private IncidenteRepository incidenteRepository;

    @Autowired
    private ReasignacionRepository reasignacionRepository;

    @BeforeEach
    void limpiarBase() {
        incidenteRepository.deleteAll();
        recorridoRepository.deleteAll();
        reasignacionRepository.deleteAll();
        asignacionTurnoRepository.deleteAll();
        checkpointRepository.deleteAll();
        turnoRepository.deleteAll();
        docenteRepository.deleteAll();
        usuarioRepository.deleteAll();
        zonaRepository.deleteAll();
    }

    @Test
    void debeConsultarMapaCalorConGet() {
        crearDatosFlujo();

        ResponseEntity<Map> response = restTemplate.getForEntity(
                "/api/v1/analiticas/mapa-calor?rango=90",
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).containsKey("resumen");
        assertThat(response.getBody()).containsKey("filas");
    }

    @Test
    void debeCrearZonaConPost() {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("nombre", "Zona Test POST");
        payload.put("descripcion", "Zona creada desde prueba automatizada");

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/v1/zonas",
                payload,
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("nombre")).isEqualTo("Zona Test POST");
    }

    @Test
    void debeActualizarZonaConPut() {
        Zona zona = new Zona();
        zona.setNombre("Zona antes PUT");
        zona.setDescripcion("Descripcion inicial");
        zona = zonaRepository.save(zona);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("nombre", "Zona despues PUT");
        payload.put("descripcion", "Descripcion actualizada");

        ResponseEntity<Map> response = restTemplate.exchange(
                "/api/v1/zonas/" + zona.getId(),
                HttpMethod.PUT,
                new HttpEntity<>(payload),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("nombre")).isEqualTo("Zona despues PUT");
    }

    @Test
    void debeEliminarZonaConDelete() {
        Zona zona = new Zona();
        zona.setNombre("Zona DELETE");
        zona.setDescripcion("Zona para eliminar");
        zona = zonaRepository.save(zona);

        ResponseEntity<Void> response = restTemplate.exchange(
                "/api/v1/zonas/" + zona.getId(),
                HttpMethod.DELETE,
                null,
                Void.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(zonaRepository.existsById(zona.getId())).isFalse();
    }

    @Test
    void debeEjecutarFlujoCompletoDocente() {
        DatosFlujo datos = crearDatosFlujo();

        Map<String, Object> checkinPayload = new LinkedHashMap<>();
        checkinPayload.put("checkpointId", datos.checkpoint().getId());
        checkinPayload.put("pin", generarPin(datos.checkpoint().getId()));

        ResponseEntity<Map> checkinResponse = restTemplate.postForEntity(
                "/api/v1/asignaciones-turnos/" + datos.asignacion().getId() + "/checkin",
                checkinPayload,
                Map.class
        );

        assertThat(checkinResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        Map<String, Object> recorridoPayload = new LinkedHashMap<>();
        recorridoPayload.put("checkpointId", datos.checkpoint().getId());
        recorridoPayload.put("asignacionId", datos.asignacion().getId());
        recorridoPayload.put("fechaHora", LocalDateTime.now().toString());

        ResponseEntity<Map> recorridoResponse = restTemplate.postForEntity(
                "/api/v1/recorridos",
                recorridoPayload,
                Map.class
        );

        assertThat(recorridoResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        Map<String, Object> incidentePayload = new LinkedHashMap<>();
        incidentePayload.put("tipo", "SEGURIDAD");
        incidentePayload.put("severidad", "MEDIA");
        incidentePayload.put("descripcion", "Incidente registrado desde prueba de sistema");
        incidentePayload.put("fechaHora", LocalDateTime.now().toString());
        incidentePayload.put("estado", "reportado");
        incidentePayload.put("asignacionId", datos.asignacion().getId());
        incidentePayload.put("ubicacion", "Zona de prueba");

        ResponseEntity<Map> incidenteResponse = restTemplate.postForEntity(
                "/api/v1/incidentes",
                incidentePayload,
                Map.class
        );

        assertThat(incidenteResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        Map<String, Object> cierrePayload = new LinkedHashMap<>();
        cierrePayload.put("horaCierre", LocalDateTime.now().plusMinutes(15).toString());
        cierrePayload.put("calificacionLimpieza", 5);
        cierrePayload.put("estadoCobertura", "cerrada");

        ResponseEntity<Map> cierreResponse = restTemplate.postForEntity(
                "/api/v1/asignaciones-turnos/" + datos.asignacion().getId() + "/cierre",
                cierrePayload,
                Map.class
        );

        assertThat(cierreResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    private DatosFlujo crearDatosFlujo() {
        Zona zona = new Zona();
        zona.setNombre("Zona Flujo");
        zona.setDescripcion("Zona para prueba de sistema");
        zona = zonaRepository.save(zona);

        Usuario usuario = new Usuario();
        usuario.setNombre("Docente Prueba");
        usuario.setEmail("docente.prueba@test.com");
        usuario.setPassword("1234");
        usuario.setRol("DOCENTE");
        usuario.setActivo(true);
        usuario = usuarioRepository.save(usuario);

        Docente docente = new Docente();
        docente.setCodigoInstitucional("DOC-TEST");
        docente.setUsuario(usuario);
        docente = docenteRepository.save(docente);

        Turno turno = new Turno();
        turno.setFecha(LocalDate.now());
        turno.setHoraInicio(LocalTime.MIN);
        turno.setHoraFin(LocalTime.MAX);
        turno.setEstado("PENDIENTE");
        turno.setZona(zona);
        turno = turnoRepository.save(turno);

        AsignacionTurno asignacion = new AsignacionTurno();
        asignacion.setDocente(docente);
        asignacion.setTurno(turno);
        asignacion.setEstadoCobertura("PENDIENTE");
        asignacion = asignacionTurnoRepository.save(asignacion);

        Checkpoint checkpoint = new Checkpoint();
        checkpoint.setNombre("Checkpoint Flujo");
        checkpoint = checkpointRepository.save(checkpoint);

        return new DatosFlujo(asignacion, checkpoint);
    }

    private String generarPin(Long checkpointId) {
        esperarSiEstaCambiandoVentanaPin();

        long windowSlot = System.currentTimeMillis() / 30000;
        long seed = (checkpointId * 7919L) + (windowSlot * 104729L);
        return String.valueOf(Math.abs(seed % 9000) + 1000).substring(0, 4);
    }

    private void esperarSiEstaCambiandoVentanaPin() {
        long milisegundosRestantes = 30000 - (System.currentTimeMillis() % 30000);

        if (milisegundosRestantes < 1500) {
            try {
                Thread.sleep(1600);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    private record DatosFlujo(AsignacionTurno asignacion, Checkpoint checkpoint) {
    }
}