package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.payload.MedicalRecordDTO;
import com.edigest.HospiTrack.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @GetMapping
    public ResponseEntity<List<MedicalRecordDTO>> getAllMedicalRecords() {
        List<MedicalRecordDTO> records = medicalRecordService.getAllMedicalRecords();
        return new ResponseEntity<>(records, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicalRecordDTO>> getMedicalRecordsByUserId(@PathVariable String userId) {
        List<MedicalRecordDTO> records = medicalRecordService.getMedicalRecordsByUserId(userId);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }
}
