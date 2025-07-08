package com.edigest.HospiTrack.controller;
import com.edigest.HospiTrack.service.DoctorService;
import com.edigest.HospiTrack.service.HospitalBranchService;
import com.edigest.HospiTrack.service.PatientService;
import com.edigest.HospiTrack.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;@RestController
@RequestMapping("/api")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/stats")
    public Map<String, Integer> getStats() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("patients", statsService.countPatients());
        stats.put("doctors", statsService.countDoctors());
        stats.put("branches", statsService.countBranches());
        return stats;
    }
}
