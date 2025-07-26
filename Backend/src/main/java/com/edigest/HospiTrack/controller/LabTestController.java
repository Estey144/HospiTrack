package com.edigest.HospiTrack.controller;
import com.edigest.HospiTrack.payload.LabTestDTO;
import com.edigest.HospiTrack.service.LabTestService;
import org.springframework.web.bind.annotation.*;
import java.sql.SQLException;
import java.util.List;

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
