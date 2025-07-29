package com.edigest.HospiTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.entity.HospitalBranch;
import com.edigest.HospiTrack.service.HospitalBranchService;

@RestController
@RequestMapping("/api")  // Base path now aligns with frontend: /api/branches
public class HospitalBranchController {

    @Autowired
    private HospitalBranchService hospitalBranchService;

    // POST /api/branches — Create a new branch
    @PostMapping("/branches")
    public ResponseEntity<HospitalBranch> createBranch(@RequestBody HospitalBranch branch) {
        try {
            HospitalBranch savedBranch = hospitalBranchService.saveBranch(branch);
            return ResponseEntity.status(201).body(savedBranch);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET /api/branches — Get all branches
    @GetMapping("/branches")
    public ResponseEntity<List<HospitalBranch>> getAllBranches() {
        try {
            List<HospitalBranch> branches = hospitalBranchService.getAllBranches();
            return ResponseEntity.ok(branches);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET /api/branches/{id} — Get branch by ID
    @GetMapping("/branches/{id}")
    public ResponseEntity<HospitalBranch> getBranchById(@PathVariable String id) {
        try {
            HospitalBranch branch = hospitalBranchService.getBranchById(id);
            return (branch != null) ? ResponseEntity.ok(branch) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // PUT /api/branches/{id} — Update branch by ID
    @PutMapping("/branches/{id}")
    public ResponseEntity<HospitalBranch> updateBranch(@PathVariable String id, @RequestBody HospitalBranch branch) {
        try {
            branch.setId(id);
            HospitalBranch updatedBranch = hospitalBranchService.saveBranch(branch); // Use saveBranch for update
            return ResponseEntity.ok(updatedBranch);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE /api/branches/{id} — Delete branch by ID
    @DeleteMapping("/branches/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable String id) {
        try {
            hospitalBranchService.deleteBranch(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // Handle foreign key constraint violations
            return ResponseEntity.status(409).build(); // 409 Conflict
        }
    }
}
