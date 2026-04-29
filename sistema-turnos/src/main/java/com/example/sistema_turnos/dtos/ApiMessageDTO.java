package com.example.sistema_turnos.dtos;

public class ApiMessageDTO {

    private String message;

    public ApiMessageDTO() {
    }

    public ApiMessageDTO(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
