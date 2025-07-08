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
    //T


}