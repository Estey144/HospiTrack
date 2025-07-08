package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.service.DoctorService;
import com.edigest.HospiTrack.service.HospitalBranchService;
import com.edigest.HospiTrack.service.PatientService;
import com.edigest.HospiTrack.service.HospitalBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StatsController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private HospitalBranchService hospitalBranchService;

    @GetMapping("/stats")
    public Map<String, Integer> getStats() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("doctors", doctorService.count());
        stats.put("patients", patientService.count());
        stats.put("branches", hospitalBranchService.count());
        return stats;
    }
}
