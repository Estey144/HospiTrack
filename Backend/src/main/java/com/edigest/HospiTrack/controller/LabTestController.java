package com.edigest.HospiTrack.controller;
import java.sql.SQLException;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.payload.LabTestDTO;
import com.edigest.HospiTrack.service.LabTestService;

@RestController
@RequestMapping("/api/lab-tests")
public class LabTestController {

    private final LabTestService labTestService;

    public LabTestController(LabTestService labTestService) {
        this.labTestService = labTestService;
    }

    @GetMapping("/user/{userId}")
    public List<LabTestDTO> getLabTestsByUserId(@PathVariable String userId) throws SQLException {
        return labTestService.getLabTestsByUserId(userId);
    }
}
