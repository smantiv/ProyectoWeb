package com.example.sistema_turnos.dtos;

public class CheckinRequestDTO {

    private Long checkpointId;
    private String pin;

    public CheckinRequestDTO() {
    }

    public Long getCheckpointId() {
        return checkpointId;
    }

    public void setCheckpointId(Long checkpointId) {
        this.checkpointId = checkpointId;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}
