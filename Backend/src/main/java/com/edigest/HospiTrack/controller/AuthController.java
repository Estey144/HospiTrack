package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Users;
import com.edigest.HospiTrack.payload.LoginRequest;
import com.edigest.HospiTrack.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder; // Make sure PasswordEncoder bean is configured

    @Autowired
    private UsersService usersService;
    public AuthController() {
        System.out.println("AuthController instantiated");
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        System.out.println("Login attempt for email: " + email);

        Users user = usersService.findByEmail(email);

        if (user == null) {
            System.out.println("User not found for email: " + email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        System.out.println("User found: " + user.getEmail());
        System.out.println("Stored password (hashed): " + user.getPassword());
        System.out.println("Password provided: " + request.getPassword());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("Password mismatch for email: " + email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        System.out.println("Password matched. Login successful for email: " + email);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("user", userInfo);

        return ResponseEntity.ok(response);
    }
}
