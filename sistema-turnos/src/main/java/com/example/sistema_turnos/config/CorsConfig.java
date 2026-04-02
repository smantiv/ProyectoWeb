package com.example.sistema_turnos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir orígenes (en desarrollo todos, en producción especificar)
        configuration.setAllowedOrigins(Arrays.asList("*"));
        
        // Permitir métodos HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Permitir headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Exponemos headers específicos
        configuration.setExposedHeaders(Arrays.asList("X-Total-Count", "X-Page-Number"));
        
        // Permitir credenciales
        configuration.setAllowCredentials(false);
        
        // Tiempo máximo de caché
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
