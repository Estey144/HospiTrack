package com.edigest.HospiTrack.payload;

import com.edigest.HospiTrack.entity.Patient;
import com.edigest.HospiTrack.entity.Users;

public class PatientSignupRequest {
    private Users user;
    private Patient patient;

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
// getters and setters

}
