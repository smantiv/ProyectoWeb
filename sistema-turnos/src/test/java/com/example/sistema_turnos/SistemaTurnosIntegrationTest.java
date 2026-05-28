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
import com.example.sistema_turnos.security.AuthUserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc(addFilters = false)
class SistemaTurnosIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
        SecurityContextHolder.clearContext();
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

    @AfterEach
    void limpiarContextoSeguridad() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void debeConsultarMapaCalorConGet() throws Exception {
        crearDatosFlujo();

        mockMvc.perform(get("/api/v1/analiticas/mapa-calor")
                        .param("rango", "90"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resumen").exists())
                .andExpect(jsonPath("$.filas").exists());
    }

    @Test
    void debeCrearZonaConPost() throws Exception {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("nombre", "Zona Test POST");
        payload.put("descripcion", "Zona creada desde prueba automatizada");

        mockMvc.perform(post("/api/v1/zonas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nombre").value("Zona Test POST"));
    }

    @Test
    void debeActualizarZonaConPut() throws Exception {
        Zona zona = new Zona();
        zona.setNombre("Zona antes PUT");
        zona.setDescripcion("Descripcion inicial");
        zona = zonaRepository.save(zona);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("nombre", "Zona despues PUT");
        payload.put("descripcion", "Descripcion actualizada");

        mockMvc.perform(put("/api/v1/zonas/{id}", zona.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(zona.getId()))
                .andExpect(jsonPath("$.nombre").value("Zona despues PUT"));
    }

    @Test
    void debeEliminarZonaConDelete() throws Exception {
        Zona zona = new Zona();
        zona.setNombre("Zona DELETE");
        zona.setDescripcion("Zona para eliminar");
        zona = zonaRepository.save(zona);

        mockMvc.perform(delete("/api/v1/zonas/{id}", zona.getId()))
                .andExpect(status().isNoContent());

        assertThat(zonaRepository.existsById(zona.getId())).isFalse();
    }

    @Test
    void debeEjecutarFlujoCompletoDocente() throws Exception {
        DatosFlujo datos = crearDatosFlujo();
        autenticarComo(datos.usuario());

        mockMvc.perform(get("/api/v1/asignaciones-turnos/actual/panel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.turnos").isArray())
                .andExpect(jsonPath("$.turnos[0].asignacionId").value(datos.asignacion().getId()));

        String pinValido = generarPin(datos.checkpoint().getId());

        Map<String, Object> checkinPayload = new LinkedHashMap<>();
        checkinPayload.put("checkpointId", datos.checkpoint().getId());
        checkinPayload.put("pin", pinValido);

        mockMvc.perform(post("/api/v1/asignaciones-turnos/{id}/checkin", datos.asignacion().getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkinPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.horaCheckin").exists())
                .andExpect(jsonPath("$.estadoCobertura").value("cubierta"));

        Map<String, Object> recorridoPayload = new LinkedHashMap<>();
        recorridoPayload.put("checkpointId", datos.checkpoint().getId());
        recorridoPayload.put("asignacionId", datos.asignacion().getId());
        recorridoPayload.put("pin", pinValido);
        recorridoPayload.put("fechaHora", LocalDateTime.now().toString());

        mockMvc.perform(post("/api/v1/recorridos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(recorridoPayload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.checkpointId").value(datos.checkpoint().getId()))
                .andExpect(jsonPath("$.asignacionId").value(datos.asignacion().getId()));

        Map<String, Object> incidentePayload = new LinkedHashMap<>();
        incidentePayload.put("tipo", "SEGURIDAD");
        incidentePayload.put("severidad", "MEDIA");
        incidentePayload.put("descripcion", "Incidente registrado desde prueba de sistema");
        incidentePayload.put("fechaHora", LocalDateTime.now().toString());
        incidentePayload.put("estado", "reportado");
        incidentePayload.put("asignacionId", datos.asignacion().getId());
        incidentePayload.put("ubicacion", "Zona de prueba");

        mockMvc.perform(post("/api/v1/incidentes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(incidentePayload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.asignacionId").value(datos.asignacion().getId()));

        Map<String, Object> cierrePayload = new LinkedHashMap<>();
        cierrePayload.put("horaCierre", LocalDateTime.now().plusMinutes(15).toString());
        cierrePayload.put("calificacionLimpieza", 4);
        cierrePayload.put("estadoCobertura", "cerrada");

        mockMvc.perform(post("/api/v1/asignaciones-turnos/{id}/cierre", datos.asignacion().getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cierrePayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.horaCierre").exists())
                .andExpect(jsonPath("$.calificacionLimpieza").value(4))
                .andExpect(jsonPath("$.estadoCobertura").value("cerrada"));
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
        turno.setHoraFin(LocalTime.of(23, 59, 59));
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

        return new DatosFlujo(usuario, asignacion, checkpoint);
    }

    private void autenticarComo(Usuario usuario) {
        AuthUserPrincipal principal = new AuthUserPrincipal(usuario);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                principal.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
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

    private record DatosFlujo(Usuario usuario, AsignacionTurno asignacion, Checkpoint checkpoint) {
    }
}
