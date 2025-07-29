package com.edigest.HospiTrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.entity.Ambulance;
import com.edigest.HospiTrack.service.AmbulanceService;

@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceController {

    private final AmbulanceService ambulanceService;

    public AmbulanceController(AmbulanceService ambulanceService) {
        this.ambulanceService = ambulanceService;
    }

    @GetMapping
    public ResponseEntity<List<Ambulance>> getAllAmbulances() {
        List<Ambulance> ambulances = ambulanceService.getAllAmbulances();
        return ResponseEntity.ok(ambulances);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ambulance> getAmbulanceById(@PathVariable String id) {
        Ambulance ambulance = ambulanceService.getAmbulanceById(id);
        if (ambulance != null) {
            return ResponseEntity.ok(ambulance);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Ambulance> createAmbulance(@RequestBody Ambulance ambulance) {
        Ambulance createdAmbulance = ambulanceService.saveAmbulance(ambulance);
        return ResponseEntity.ok(createdAmbulance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ambulance> updateAmbulance(@PathVariable String id, @RequestBody Ambulance ambulance) {
        ambulance.setId(id);
        Ambulance updatedAmbulance = ambulanceService.saveAmbulance(ambulance);
        return ResponseEntity.ok(updatedAmbulance);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAmbulance(@PathVariable String id) {
        ambulanceService.deleteAmbulance(id);
        return ResponseEntity.noContent().build();
    }
}
