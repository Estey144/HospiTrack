package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.HospitalBranch;
import com.edigest.HospiTrack.service.HospitalBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/branches")
public class HospitalBranchController {

    @Autowired
    private HospitalBranchService hospitalBranchService;

    @PostMapping
    public ResponseEntity<HospitalBranch> createBranch(@RequestBody HospitalBranch branch) {
        HospitalBranch savedBranch = hospitalBranchService.saveBranch(branch);
        return ResponseEntity.status(201).body(savedBranch);
    }

    @GetMapping
    public ResponseEntity<List<HospitalBranch>> getAllBranches() {
        List<HospitalBranch> branches = hospitalBranchService.getAllBranches();
        return ResponseEntity.ok(branches);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalBranch> getBranchById(@PathVariable String id) {
        HospitalBranch branch = hospitalBranchService.getBranchById(id);
        if (branch != null) {
            return ResponseEntity.ok(branch);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable String id) {
        hospitalBranchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}
