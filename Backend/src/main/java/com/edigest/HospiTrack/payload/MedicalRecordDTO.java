package com.edigest.HospiTrack.payload;
import java.util.List;
import java.util.Map;

public class MedicalRecordDTO {
    private String id;              // appointment id
    private String date;            // appointment date
    private String type;            // appointment type
    private String doctorName;
    private String department;
    private String diagnosis;       // from prescriptions.notes
    private String notes;           // from prescriptions.notes

    private List<String> symptoms;         // from Symptom_Checker
    private String treatment;              // from prescription notes (or separate field if exists)
    private List<String> medications;      // medicine_name + dosage
    private Map<String, String> vitals;    // from Device_Logs (latest values)
    private List<String> labResults;       // from Lab_Tests
    private List<String> attachments;      // file URLs from Lab_Tests.file_url

    // Getters and setters for all fields
    // (Omitted here for brevity but must be added)

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    public List<String> getMedications() {
        return medications;
    }

    public void setMedications(List<String> medications) {
        this.medications = medications;
    }

    public Map<String, String> getVitals() {
        return vitals;
    }

    public void setVitals(Map<String, String> vitals) {
        this.vitals = vitals;
    }

    public List<String> getLabResults() {
        return labResults;
    }

    public void setLabResults(List<String> labResults) {
        this.labResults = labResults;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }
}

