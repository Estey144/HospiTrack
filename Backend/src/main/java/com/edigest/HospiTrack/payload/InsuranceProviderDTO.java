package com.edigest.HospiTrack.payload;

public class InsuranceProviderDTO {
    private String id;
    private String name;
    private String contactInfo;

    // Constructors
    public InsuranceProviderDTO() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
}