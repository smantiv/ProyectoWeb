package com.example.sistema_turnos.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.Instant;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            TokenAuthenticationFilter tokenAuthenticationFilter,
            ObjectMapper objectMapper) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            objectMapper.writeValue(response.getWriter(), Map.of(
                                    "timestamp", Instant.now().toString(),
                                    "status", 401,
                                    "error", "No autenticado",
                                    "message", "Debes iniciar sesion para acceder a este recurso",
                                    "path", request.getRequestURI()
                            ));
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            objectMapper.writeValue(response.getWriter(), Map.of(
                                    "timestamp", Instant.now().toString(),
                                    "status", 403,
                                    "error", "Acceso denegado",
                                    "message", "Tu rol no tiene permiso para acceder a este recurso",
                                    "path", request.getRequestURI()
                            ));
                        }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/v1/auth/login", "/actuator/health").permitAll()
                        .requestMatchers("/api/v1/auth/me").authenticated()

                        .requestMatchers("/api/v1/usuarios", "/api/v1/usuarios/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/v1/docentes/actual").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/docentes", "/api/v1/docentes/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers(HttpMethod.POST, "/api/v1/docentes", "/api/v1/docentes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/docentes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/docentes/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/v1/zonas", "/api/v1/zonas/**").hasAnyRole("ADMIN", "COORDINADOR", "DOCENTE")
                        .requestMatchers("/api/v1/zonas", "/api/v1/zonas/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/v1/turnos", "/api/v1/turnos/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers("/api/v1/turnos", "/api/v1/turnos/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/v1/asignaciones-turnos/actual/panel").hasRole("DOCENTE")
                        .requestMatchers(HttpMethod.GET, "/api/v1/asignaciones-turnos/activas").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/asignaciones-turnos", "/api/v1/asignaciones-turnos/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers(HttpMethod.POST, "/api/v1/asignaciones-turnos/*/checkin").hasRole("DOCENTE")
                        .requestMatchers(HttpMethod.POST, "/api/v1/asignaciones-turnos/*/cierre").hasRole("DOCENTE")
                        .requestMatchers("/api/v1/asignaciones-turnos", "/api/v1/asignaciones-turnos/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/v1/checkpoints", "/api/v1/checkpoints/**").hasAnyRole("ADMIN", "COORDINADOR", "DOCENTE")
                        .requestMatchers("/api/v1/checkpoints", "/api/v1/checkpoints/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/v1/recorridos", "/api/v1/recorridos/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers(HttpMethod.POST, "/api/v1/recorridos", "/api/v1/recorridos/**").hasRole("DOCENTE")
                        .requestMatchers("/api/v1/recorridos", "/api/v1/recorridos/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/v1/incidentes", "/api/v1/incidentes/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers(HttpMethod.POST, "/api/v1/incidentes", "/api/v1/incidentes/**").hasAnyRole("DOCENTE", "COORDINADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/incidentes/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers("/api/v1/incidentes", "/api/v1/incidentes/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/v1/reasignaciones/actual").hasRole("DOCENTE")
                        .requestMatchers(HttpMethod.GET, "/api/v1/reasignaciones/candidatos/**").hasAnyRole("DOCENTE", "COORDINADOR")
                        .requestMatchers(HttpMethod.POST, "/api/v1/reasignaciones", "/api/v1/reasignaciones/**").hasRole("DOCENTE")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/reasignaciones/*/responder").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/reasignaciones", "/api/v1/reasignaciones/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers("/api/v1/reasignaciones", "/api/v1/reasignaciones/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/v1/analiticas/**").hasAnyRole("ADMIN", "COORDINADOR")

                        .requestMatchers("/api/v1/**").hasRole("ADMIN")
                        .anyRequest().permitAll()
                )
                .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

            @Override
            public String encode(CharSequence rawPassword) {
                return bcrypt.encode(rawPassword);
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                if (rawPassword == null || encodedPassword == null) {
                    return false;
                }
                if (encodedPassword.startsWith("$2a$")
                        || encodedPassword.startsWith("$2b$")
                        || encodedPassword.startsWith("$2y$")) {
                    return bcrypt.matches(rawPassword, encodedPassword);
                }
                return rawPassword.toString().equals(encodedPassword);
            }
        };
    }
}
