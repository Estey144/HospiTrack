package com.edigest.HospiTrack.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.payload.PrescriptionResponseDTO;
import com.edigest.HospiTrack.service.PrescriptionService;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PrescriptionController {

    private final PrescriptionService service;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponseDTO>> getByPatient(@PathVariable String patientId) {
        List<PrescriptionResponseDTO> list = service.getByPatientId(patientId);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createPrescription(@RequestBody Map<String, Object> request) {
        System.out.println("Creating prescription: " + request);
        
        try {
            String prescriptionId = UUID.randomUUID().toString();
            String appointmentId = (String) request.get("appointmentId");
            String patientId = (String) request.get("patientId");
            String notes = (String) request.get("notes");
            
            String sql = "INSERT INTO Prescriptions (id, appointment_id, patient_id, notes, date_issued) " +
                        "VALUES (?, ?, ?, ?, SYSDATE)";
            
            int rowsInserted = jdbcTemplate.update(sql, prescriptionId, appointmentId, patientId, notes);
            
            Map<String, String> response = new HashMap<>();
            if (rowsInserted > 0) {
                response.put("status", "success");
                response.put("message", "Prescription created successfully");
                response.put("id", prescriptionId);
                System.out.println("Created prescription with ID: " + prescriptionId);
            } else {
                response.put("status", "error");
                response.put("message", "Failed to create prescription");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error creating prescription: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to create prescription: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
