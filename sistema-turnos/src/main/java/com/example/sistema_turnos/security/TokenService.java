package com.example.sistema_turnos.security;

import com.example.sistema_turnos.entities.Usuario;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class TokenService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long expirationHours;

    public TokenService(
            ObjectMapper objectMapper,
            @Value("${app.security.token-secret:sistema-turnos-dev-secret-change-me}") String secret,
            @Value("${app.security.token-expiration-hours:8}") long expirationHours) {
        this.objectMapper = objectMapper;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationHours = expirationHours;
    }

    public String generarToken(Usuario usuario) {
        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", usuario.getId());
        payload.put("email", usuario.getEmail());
        payload.put("rol", usuario.getRol());
        payload.put("exp", Instant.now().plusSeconds(expirationHours * 3600).getEpochSecond());

        String headerPart = encodeJson(header);
        String payloadPart = encodeJson(payload);
        String unsignedToken = headerPart + "." + payloadPart;
        return unsignedToken + "." + firmar(unsignedToken);
    }

    public TokenClaims validarToken(String token) {
        String[] parts = token != null ? token.split("\\.") : new String[0];
        if (parts.length != 3) {
            throw new BadCredentialsException("Token invalido");
        }

        String unsignedToken = parts[0] + "." + parts[1];
        if (!firmar(unsignedToken).equals(parts[2])) {
            throw new BadCredentialsException("Firma de token invalida");
        }

        Map<String, Object> payload = decodeJson(parts[1]);
        long exp = ((Number) payload.get("exp")).longValue();
        if (Instant.now().getEpochSecond() >= exp) {
            throw new BadCredentialsException("Token expirado");
        }

        return new TokenClaims(
                ((Number) payload.get("sub")).longValue(),
                String.valueOf(payload.get("email")),
                String.valueOf(payload.get("rol"))
        );
    }

    private String encodeJson(Map<String, Object> data) {
        try {
            return base64Url(objectMapper.writeValueAsBytes(data));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo serializar el token", e);
        }
    }

    private Map<String, Object> decodeJson(String part) {
        try {
            return objectMapper.readValue(Base64.getUrlDecoder().decode(part), MAP_TYPE);
        } catch (Exception e) {
            throw new BadCredentialsException("Payload de token invalido", e);
        }
    }

    private String firmar(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret, HMAC_ALGORITHM));
            return base64Url(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo firmar el token", e);
        }
    }

    private String base64Url(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public record TokenClaims(Long usuarioId, String email, String rol) {
    }
}
