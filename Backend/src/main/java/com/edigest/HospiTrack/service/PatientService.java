package com.edigest.HospiTrack.service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.edigest.HospiTrack.entity.Patient;

@Service
public class PatientService {

    @Autowired
    private JdbcTemplate jdbc;

    //  SELECT all patients
    public List<Patient> getAllPatients() {
        String sql = "SELECT * FROM Patients"; // <-- RAW SQL HERE
        return jdbc.query(sql, new BeanPropertyRowMapper<>(Patient.class));
    }

    // SELECT all patients with names from Users table
    public List<Map<String, Object>> getAllPatientsWithNames() {
        try {
            String sql = "SELECT p.id, p.user_id, u.name, p.dob, p.gender, p.blood_type, " +
                        "p.address, p.emergency_contact, u.phone " +
                        "FROM Patients p " +
                        "JOIN Users u ON p.user_id = u.id " +
                        "ORDER BY u.name";
            
            return jdbc.query(sql, (rs, rowNum) -> {
                Map<String, Object> patient = new HashMap<>();
                patient.put("id", rs.getString("id"));
                patient.put("userId", rs.getString("user_id"));
                patient.put("name", rs.getString("name"));
                patient.put("dob", rs.getTimestamp("dob"));
                patient.put("gender", rs.getString("gender"));
                patient.put("bloodType", rs.getString("blood_type"));
                patient.put("address", rs.getString("address"));
                patient.put("emergencyContact", rs.getString("emergency_contact"));
                patient.put("phone", rs.getString("phone"));
                return patient;
            });
        } catch (Exception e) {
            return new ArrayList<>();
        }
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

    //  UPDATE a patient
    public Patient updatePatient(Patient patient) {
        String sql = "UPDATE Patients SET user_id = ?, dob = ?, gender = ?, blood_type = ?, " +
                "address = ?, emergency_contact = ? WHERE id = ?"; // <-- RAW SQL HERE
        jdbc.update(sql,
                patient.getUserId(),
                (patient.getDob() != null ? new Date(patient.getDob().getTime()) : null),
                patient.getGender(),
                patient.getBloodType(),
                patient.getAddress(),
                patient.getEmergencyContact(),
                patient.getId()
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
