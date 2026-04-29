package com.example.sistema_turnos.services;

import com.example.sistema_turnos.dtos.ZonaDTO;
import com.example.sistema_turnos.entities.Zona;
import com.example.sistema_turnos.repositories.ZonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ZonaService {

    @Autowired
    private ZonaRepository zonaRepository;

    public ZonaDTO crearZona(@NonNull ZonaDTO zonaDTO) {
        Zona zona = new Zona();
        zona.setNombre(zonaDTO.getNombre());
        zona.setDescripcion(zonaDTO.getDescripcion());

        Zona zonaGuardada = zonaRepository.save(zona);
        return convertToDTO(zonaGuardada);
    }

    public ZonaDTO obtenerZonaPorId(@NonNull Long id) {
        Optional<Zona> zona = zonaRepository.findById(id);
        return zona.map(this::convertToDTO).orElse(null);
    }

    public ZonaDTO obtenerZonaPorNombre(@NonNull String nombre) {
        Optional<Zona> zona = zonaRepository.findByNombre(nombre);
        return zona.map(this::convertToDTO).orElse(null);
    }

    public List<ZonaDTO> obtenerTodasLasZonas() {
        return zonaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ZonaDTO actualizarZona(@NonNull Long id, @NonNull ZonaDTO zonaDTO) {
        Optional<Zona> zonaExistente = zonaRepository.findById(id);
        if (zonaExistente.isPresent()) {
            Zona zona = zonaExistente.get();
            zona.setNombre(zonaDTO.getNombre());
            zona.setDescripcion(zonaDTO.getDescripcion());

            Zona zonaActualizada = zonaRepository.save(zona);
            return convertToDTO(zonaActualizada);
        }
        return null;
    }

    public boolean eliminarZona(@NonNull Long id) {
        if (zonaRepository.existsById(id)) {
            zonaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private ZonaDTO convertToDTO(Zona zona) {
        return new ZonaDTO(zona.getId(), zona.getNombre(), zona.getDescripcion());
    }
}
