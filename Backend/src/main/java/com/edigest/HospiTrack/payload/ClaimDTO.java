package com.edigest.HospiTrack.payload;

public class ClaimDTO {
    private String id;
    private String claimStatus;
    private double claimAmount;
    private String submittedOn;
    private String provider;
    private String service;
    private double paid;
    private double approved;
    private double patientResponsibility;
    private String insurancePlan;

    // Constructors
    public ClaimDTO() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClaimStatus() { return claimStatus; }
    public void setClaimStatus(String claimStatus) { this.claimStatus = claimStatus; }

    public double getClaimAmount() { return claimAmount; }
    public void setClaimAmount(double claimAmount) { this.claimAmount = claimAmount; }

    public String getSubmittedOn() { return submittedOn; }
    public void setSubmittedOn(String submittedOn) { this.submittedOn = submittedOn; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public double getPaid() { return paid; }
    public void setPaid(double paid) { this.paid = paid; }

    public double getApproved() { return approved; }
    public void setApproved(double approved) { this.approved = approved; }

    public double getPatientResponsibility() { return patientResponsibility; }
    public void setPatientResponsibility(double patientResponsibility) { this.patientResponsibility = patientResponsibility; }

    public String getInsurancePlan() { return insurancePlan; }
    public void setInsurancePlan(String insurancePlan) { this.insurancePlan = insurancePlan; }
}