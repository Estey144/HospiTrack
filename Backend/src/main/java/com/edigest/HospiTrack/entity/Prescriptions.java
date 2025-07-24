package com.edigest.HospiTrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "PRESCRIPTIONS")
public class Prescriptions {

    @Id
    @Column(name = "ID", length = 36)
    @NotBlank(message = "Prescription ID is required")
    private String id;

    @Column(name = "APPOINTMENT_ID", length = 36)
    private String appointmentId;

    @Column(name = "DOCTOR_ID", length = 36)
    private String doctorId;

    @Column(name = "PATIENT_ID", length = 36)
    private String patientId;

    @Lob
    @Column(name = "NOTES")
    private String notes;

    @Column(name = "DATE_ISSUED")
    private Date dateIssued;

    // Getters and Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Date getDateIssued() { return dateIssued; }
    public void setDateIssued(Date dateIssued) { this.dateIssued = dateIssued; }
}
