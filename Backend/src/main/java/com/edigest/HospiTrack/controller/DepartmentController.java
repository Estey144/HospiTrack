package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Department;
import com.edigest.HospiTrack.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService service;

    @GetMapping
    public List<Department> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Department getById(@PathVariable Long id) {
        return service.getById(String.valueOf(id));
    }

    @PostMapping
    public Department create(@RequestBody Department department) {
        return service.save(department);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(String.valueOf(id));
    }
}

