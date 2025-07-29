package com.edigest.HospiTrack.payload;

public class PatientInsuranceDTO {
    private String id;
    private String patientId;
    private String providerId;
    private String providerName;
    private String policyNumber;
    private String coverageDetails;

    // Constructors
    public PatientInsuranceDTO() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getCoverageDetails() { return coverageDetails; }
    public void setCoverageDetails(String coverageDetails) { this.coverageDetails = coverageDetails; }
}