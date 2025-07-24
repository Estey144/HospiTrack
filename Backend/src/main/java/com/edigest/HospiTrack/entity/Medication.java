package com.edigest.HospiTrack.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "Medication")
public class Medication {
    //CREATE TABLE Medications (
    //                             id VARCHAR2(36) PRIMARY KEY,
    //                             medicine_name VARCHAR2(100),
    //                             dosage VARCHAR2(50),
    //                             duration VARCHAR2(50)
    //);
    @Id
    @NotBlank
    private String id;

    private String medicine_name;
    private String dosage;

    public @NotBlank String getId() {
        return id;
    }

    public void setId(@NotBlank String id) {
        this.id = id;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getMedicine_name() {
        return medicine_name;
    }

    public void setMedicine_name(String medicine_name) {
        this.medicine_name = medicine_name;
    }
}