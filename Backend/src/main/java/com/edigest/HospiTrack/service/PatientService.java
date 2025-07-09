package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class PatientService {

    @Autowired
    private JdbcTemplate jdbc;

    //  SELECT all patients
    public List<Patient> getAllPatients() {
        String sql = "SELECT * FROM Patients"; // <-- RAW SQL HERE
        return jdbc.query(sql, new BeanPropertyRowMapper<>(Patient.class));
    }

    //  SELECT a patient by ID
    public Patient getPatientById(String id) {
        String sql = "SELECT * FROM Patients WHERE id = ?"; // <-- RAW SQL HERE
        List<Patient> patients = jdbc.query(sql, new BeanPropertyRowMapper<>(Patient.class), id);
        return patients.isEmpty() ? null : patients.get(0);
    }

    //  INSERT a patient
    public Patient savePatient(Patient patient) {
        String sql = "INSERT INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)"; // <-- RAW SQL HERE
        jdbc.update(sql,
                patient.getId(),
                patient.getUserId(),
                (patient.getDob() != null ? new Date(patient.getDob().getTime()) : null),
                patient.getGender(),
                patient.getBloodType(),
                patient.getAddress(),
                patient.getEmergencyContact()
        );
        return patient;
    }

    //  DELETE a patient by ID
    public void deletePatient(String id) {
        String sql = "DELETE FROM Patients WHERE id = ?"; // <-- RAW SQL HERE
        jdbc.update(sql, id);
    }
    public int countPatients() {
        String sql = "SELECT COUNT(*) FROM Users WHERE role = 'patient'";
        Integer count = jdbc.queryForObject(sql, Integer.class);
        return (count != null) ? count : 0;
    }


}
