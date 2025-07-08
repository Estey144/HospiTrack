package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Doctor;
import com.edigest.HospiTrack.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService service;

    @GetMapping
    public List<Doctor> getAll() {
        return service.getAllDoctors();
    }

    @GetMapping("/{id}")
    public Doctor getById(@PathVariable String id) {
        return service.getDoctorById(id);
    }

    @PostMapping
    public Doctor create(@RequestBody Doctor doctor) {
        return service.saveDoctor(doctor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.deleteDoctor(id);
    }
}
