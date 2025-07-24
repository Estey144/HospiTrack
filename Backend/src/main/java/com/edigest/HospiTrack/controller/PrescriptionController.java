package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.payload.PrescriptionResponseDTO;
import com.edigest.HospiTrack.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponseDTO>> getByPatient(@PathVariable String patientId) {
        List<PrescriptionResponseDTO> list = service.getByPatientId(patientId);
        return ResponseEntity.ok(list);
    }
}
