package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Users;
import com.edigest.HospiTrack.service.UsersService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersService service;

    @GetMapping
    public List<Users> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Users getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public Users create(@Valid @RequestBody Users user) {
        return service.save(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
