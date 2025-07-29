package com.edigest.HospiTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.payload.BenefitDTO;
import com.edigest.HospiTrack.payload.ClaimDTO;
import com.edigest.HospiTrack.payload.InsuranceProviderDTO;
import com.edigest.HospiTrack.payload.PatientInsuranceDTO;
import com.edigest.HospiTrack.service.InsuranceService;

@RestController
@RequestMapping("/api")
public class InsuranceController {

    @Autowired
    private InsuranceService insuranceService;

    // Test endpoint for debugging
    @GetMapping("/insurance/test")
    public ResponseEntity<String> testEndpoint() {
        System.out.println("Controller: Test endpoint called");
        return ResponseEntity.ok("Insurance API is working!");
    }

    // Frontend calls: /api/insurance/plans?patientId=${user.id}
    @GetMapping("/insurance/plans")
    public ResponseEntity<List<PatientInsuranceDTO>> getInsurancePlans(@RequestParam String patientId) {
        System.out.println("Controller: Getting insurance plans for patient: " + patientId);
        List<PatientInsuranceDTO> plans = insuranceService.getInsurancePlans(patientId);
        System.out.println("Controller: Returning " + plans.size() + " insurance plans");
        return ResponseEntity.ok(plans);
    }

    // Frontend calls: /api/insurance/claims?patientId=${user.id}
    @GetMapping("/insurance/claims")
    public ResponseEntity<List<ClaimDTO>> getClaims(@RequestParam String patientId) {
        System.out.println("Controller: Getting claims for patient: " + patientId);
        List<ClaimDTO> claims = insuranceService.getClaimsForPatient(patientId);
        System.out.println("Controller: Returning " + claims.size() + " claims");
        return ResponseEntity.ok(claims);
    }

    // Frontend calls: /api/insurance/providers
    @GetMapping("/insurance/providers")
    public ResponseEntity<List<InsuranceProviderDTO>> getAllProviders() {
        System.out.println("Controller: Getting all insurance providers");
        List<InsuranceProviderDTO> providers = insuranceService.getAllInsuranceProviders();
        System.out.println("Controller: Returning " + providers.size() + " providers");
        return ResponseEntity.ok(providers);
    }

    // Frontend calls: /api/patient-insurance (POST)
    @PostMapping("/patient-insurance")
    public ResponseEntity<PatientInsuranceDTO> addInsurancePlan(@RequestBody PatientInsuranceDTO dto) {
        System.out.println("Controller: Adding insurance plan for patient: " + dto.getPatientId());
        PatientInsuranceDTO addedPlan = insuranceService.addInsurancePlan(dto);
        System.out.println("Controller: Successfully added insurance plan with ID: " + addedPlan.getId());
        return ResponseEntity.ok(addedPlan);
    }

    // Frontend calls: /api/benefits/${user.id}
    @GetMapping("/benefits/{patientId}")
    public ResponseEntity<List<BenefitDTO>> getBenefits(@PathVariable String patientId) {
        System.out.println("Controller: Getting benefits for patient: " + patientId);
        List<BenefitDTO> benefits = insuranceService.getBenefitsForPatient(patientId);
        System.out.println("Controller: Returning " + benefits.size() + " benefit categories");
        return ResponseEntity.ok(benefits);
    }
}