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
    @GetMapping("/doctors/names")
    public List<Map<String, Object>> getDoctorsNames() {
        return service.getDoctorsForFeedback();
    }
    @GetMapping("/doctors")
    public List<Map<String, Object>> getAllDoctors() {
        for(Map<String, Object> doctor : service.getAllDoctorsForFrontend()) {
            System.out.println("Doctor ID: " + doctor.get("doctorId"));
            System.out.println("Doctor Name: " + doctor.get("doctorName"));
            System.out.println("Experience Years: " + doctor.get("experienceYears"));
            System.out.println("Branch Name: " + doctor.get("branchName"));
            System.out.println("Department Name: " + doctor.get("departmentName"));
        }
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
