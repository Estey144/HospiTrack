package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Appointment;
import com.edigest.HospiTrack.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService service;

    @PostMapping
    public Appointment create(@RequestBody Appointment a) {
        return service.save(a);
    }

    @GetMapping
    public List<Appointment> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
