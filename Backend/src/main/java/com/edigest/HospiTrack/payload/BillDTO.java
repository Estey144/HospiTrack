package com.edigest.HospiTrack.payload;

import java.util.Date;
import java.util.List;

public class BillDTO {
    private String id;
    private String patientId;
    private String appointmentId;
    private double totalAmount;
    private String status;
    private Date issueDate;
    private List<BillItemDTO> items;

    // Additional metadata
    private String doctorName;
    private String appointmentType;
    private String department;
    private Date visitDate;


    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getIssueDate() { return issueDate; }
    public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }

    public List<BillItemDTO> getItems() { return items; }
    public void setItems(List<BillItemDTO> items) { this.items = items; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getAppointmentType() { return appointmentType; }
    public void setAppointmentType(String appointmentType) { this.appointmentType = appointmentType; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Date getVisitDate() { return visitDate; }
    public void setVisitDate(Date visitDate) { this.visitDate = visitDate; }
}
