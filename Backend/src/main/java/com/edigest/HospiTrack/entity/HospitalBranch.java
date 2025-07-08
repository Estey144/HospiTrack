package com.edigest.HospiTrack.entity;

import java.util.Date;

public class HospitalBranch {
    private String id;
    private String name;
    private String address;
    private Date establishedDate;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Date getEstablishedDate() { return establishedDate; }
    public void setEstablishedDate(Date establishedDate) { this.establishedDate = establishedDate; }
}
