package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.HospitalBranch;
import com.edigest.HospiTrack.service.HospitalBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")  // Base path now aligns with frontend: /api/branches
public class HospitalBranchController {

    @Autowired
    private HospitalBranchService hospitalBranchService;

//    // POST /api/branches — Create a new branch
//    @PostMapping
//    public ResponseEntity<HospitalBranch> createBranch(@RequestBody HospitalBranch branch) {
//        HospitalBranch savedBranch = hospitalBranchService.saveBranch(branch);
//        return ResponseEntity.status(201).body(savedBranch);
//    }

    // GET /api/branches — Get all branches
    @GetMapping("/branches")
    public ResponseEntity<List<HospitalBranch>> getAllBranches() {
        List<HospitalBranch> branches = hospitalBranchService.getAllBranches();
        return ResponseEntity.ok(branches);
    }

    // GET /api/branches/{id} — Get branch by ID
    @GetMapping("/id")
    public ResponseEntity<HospitalBranch> getBranchById(@PathVariable String id) {
        HospitalBranch branch = hospitalBranchService.getBranchById(id);
        return (branch != null) ? ResponseEntity.ok(branch) : ResponseEntity.notFound().build();
    }

    // DELETE /api/branches/{id} — Delete branch by ID
    @DeleteMapping("/id")
    public ResponseEntity<Void> deleteBranch(@PathVariable String id) {
        hospitalBranchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}
