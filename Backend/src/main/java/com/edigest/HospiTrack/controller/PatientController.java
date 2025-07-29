package com.edigest.HospiTrack.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.entity.Patient;
import com.edigest.HospiTrack.service.PatientService;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public List<Patient> getAll() {
        return patientService.getAllPatients();
    }

    @GetMapping("/with-names")
    public List<Map<String, Object>> getAllPatientsWithNames() {
        return patientService.getAllPatientsWithNames();
    }

    @GetMapping("/{id}")
    public Patient getById(@PathVariable String id) {
        return patientService.getPatientById(id);
    }

    @PostMapping
    public Patient create(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @PutMapping("/{id}")
    public Patient update(@PathVariable String id, @RequestBody Patient patient) {
        patient.setId(id); // Ensure the ID matches the path variable
        return patientService.updatePatient(patient);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        patientService.deletePatient(id);
        return "Patient deleted";
    }

    //  get patient ID by user ID
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<String> getPatientIdByUserId(@PathVariable String userId) {
        try {
            String sql = "SELECT id FROM PATIENTS WHERE USER_ID = ?";
            String patientId = jdbcTemplate.queryForObject(sql, new Object[]{userId}, String.class);
            return ResponseEntity.ok(patientId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found for user ID: " + userId);
        }
    }
}
