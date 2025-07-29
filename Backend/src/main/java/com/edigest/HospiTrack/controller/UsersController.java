package com.edigest.HospiTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.entity.Users;
import com.edigest.HospiTrack.service.UsersService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
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

    @PutMapping("/{id}")
    public Users update(@PathVariable String id, @Valid @RequestBody Users user) {
        user.setId(id);
        return service.save(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
