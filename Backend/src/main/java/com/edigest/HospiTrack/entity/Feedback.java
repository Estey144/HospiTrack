package com.edigest.HospiTrack.entity;

import java.util.Date;

public class Feedback {
    private String id;
    private String patientId;
    private String targetType;
    private String targetId;
    private int rating;
    private String comments;
    private Date dateSubmitted;
    private String targetName;
    private String patientName;


    public String getTargetName() { return targetName; }
    public void setTargetName(String targetName) { this.targetName = targetName; }


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Date getDateSubmitted() { return dateSubmitted; }
    public void setDateSubmitted(Date dateSubmitted) { this.dateSubmitted = dateSubmitted; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
}