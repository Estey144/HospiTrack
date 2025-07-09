package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.payload.PatientSignupRequest;
import com.edigest.HospiTrack.service.SignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/signup")
public class SignupController {

    @Autowired
    private SignupService signupService;

    @PostMapping("/patient")
    public ResponseEntity<?> registerPatient(@RequestBody PatientSignupRequest request) {
        try {
            String result = signupService.registerPatient(request.getPatient(), request.getUser());
            if (result.equals("exists")) {
                return ResponseEntity.badRequest().body("Email already exists.");
            }
            if (result.equals("error")) {
                return ResponseEntity.internalServerError().body("Something went wrong.");
            }
            return ResponseEntity.ok("Patient registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Signup failed.");
        }
    }

}
