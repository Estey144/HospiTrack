package com.edigest.HospiTrack.entity;

public class Ambulance {
    private String id;
    private String vehicleNumber;
    private String status;
    private String location;
    private String branchId;

    // Default constructor
    public Ambulance() {}

    // Constructor with all fields
    public Ambulance(String id, String vehicleNumber, String status, String location, String branchId) {
        this.id = id;
        this.vehicleNumber = vehicleNumber;
        this.status = status;
        this.location = location;
        this.branchId = branchId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBranchId() {
        return branchId;
    }

    public void setBranchId(String branchId) {
        this.branchId = branchId;
    }

    @Override
    public String toString() {
        return "Ambulance{" +
                "id='" + id + '\'' +
                ", vehicleNumber='" + vehicleNumber + '\'' +
                ", status='" + status + '\'' +
                ", location='" + location + '\'' +
                ", branchId='" + branchId + '\'' +
                '}';
    }
}
