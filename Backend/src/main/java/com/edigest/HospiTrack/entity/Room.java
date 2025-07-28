package com.edigest.HospiTrack.entity;

public class Room {

    private String id;
    private String roomNumber;
    private String type;
    private String status;

    public Room() {}

    public Room(String id, String roomNumber, String type, String status) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.type = type;
        this.status = status;
    }

    // getters and setters

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }
    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}

