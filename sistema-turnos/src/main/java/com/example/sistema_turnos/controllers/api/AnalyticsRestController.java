package com.example.sistema_turnos.controllers.api;

import com.example.sistema_turnos.dtos.AnalyticsHeatmapResponseDTO;
import com.example.sistema_turnos.services.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analiticas")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsRestController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/mapa-calor")
    public ResponseEntity<AnalyticsHeatmapResponseDTO> obtenerMapaCalor(
            @RequestParam(required = false, defaultValue = "7") String rango,
            @RequestParam(required = false) Long zonaId,
            @RequestParam(required = false, defaultValue = "Todos") String tipo) {
        return ResponseEntity.ok(analyticsService.obtenerMapaCalor(rango, zonaId, tipo));
    }
}
