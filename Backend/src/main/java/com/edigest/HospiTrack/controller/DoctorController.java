package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Doctor;
import com.edigest.HospiTrack.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api")
public class DoctorController {

    @Autowired
    private DoctorService service;

    @Autowired
    private JdbcTemplate jdbc;

    @GetMapping("/doctors/raw")
    public List<Doctor> getAllRaw() {
        return service.getAllDoctors();
    }

    @GetMapping("/doctors")  // <-- fix here
    public List<Map<String, Object>> getAllDoctors() {
        return service.getAllDoctorsForFrontend();
    }

    @GetMapping("/doctors/{id}")
    public Doctor getById(@PathVariable String id) {
        return service.getDoctorById(id);
    }

    @PostMapping("/doctors")
    public Doctor create(@RequestBody Doctor doctor) {
        return service.saveDoctor(doctor);
    }

    @DeleteMapping("/doctors/{id}")
    public void delete(@PathVariable String id) {
        service.deleteDoctor(id);
    }
}
