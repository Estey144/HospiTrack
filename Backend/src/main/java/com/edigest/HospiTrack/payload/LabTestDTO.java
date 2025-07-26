package com.edigest.HospiTrack.payload;

public class LabTestDTO {
    private String id;
    private String testType;
    private String result;
    private String fileUrl;
    private String testDate; // Use String for simplicity or LocalDate for date
    private String doctorName; // Optional, if you want to include doctor's name

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getTestDate() { return testDate; }
    public void setTestDate(String testDate) { this.testDate = testDate; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
}
