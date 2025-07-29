package com.edigest.HospiTrack.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditController {

    @GetMapping
    public List<Map<String, Object>> getAuditLogs() {
        List<Map<String, Object>> logs = new ArrayList<>();
        
        // Sample audit logs - In a real application, these would come from a database
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        Map<String, Object> log1 = new HashMap<>();
        log1.put("id", 1);
        log1.put("action", "User Login");
        log1.put("user", "admin@hospital.com");
        log1.put("details", "Admin user logged into the system");
        log1.put("timestamp", now.minusMinutes(30).format(formatter));
        log1.put("severity", "info");
        log1.put("ipAddress", "192.168.1.100");
        logs.add(log1);

        Map<String, Object> log2 = new HashMap<>();
        log2.put("id", 2);
        log2.put("action", "Patient Created");
        log2.put("user", "admin@hospital.com");
        log2.put("details", "New patient account created for John Doe");
        log2.put("timestamp", now.minusHours(1).format(formatter));
        log2.put("severity", "info");
        log2.put("ipAddress", "192.168.1.100");
        logs.add(log2);

        Map<String, Object> log3 = new HashMap<>();
        log3.put("id", 3);
        log3.put("action", "Doctor Updated");
        log3.put("user", "admin@hospital.com");
        log3.put("details", "Doctor profile updated for Dr. Sarah Johnson");
        log3.put("timestamp", now.minusHours(2).format(formatter));
        log3.put("severity", "warning");
        log3.put("ipAddress", "192.168.1.100");
        logs.add(log3);

        Map<String, Object> log4 = new HashMap<>();
        log4.put("id", 4);
        log4.put("action", "Data Export");
        log4.put("user", "admin@hospital.com");
        log4.put("details", "Patient data exported for backup purposes");
        log4.put("timestamp", now.minusHours(3).format(formatter));
        log4.put("severity", "warning");
        log4.put("ipAddress", "192.168.1.100");
        logs.add(log4);

        Map<String, Object> log5 = new HashMap<>();
        log5.put("id", 5);
        log5.put("action", "System Backup");
        log5.put("user", "System");
        log5.put("details", "Automated system backup completed successfully");
        log5.put("timestamp", now.minusHours(6).format(formatter));
        log5.put("severity", "success");
        log5.put("ipAddress", "127.0.0.1");
        logs.add(log5);

        Map<String, Object> log6 = new HashMap<>();
        log6.put("id", 6);
        log6.put("action", "Failed Login Attempt");
        log6.put("user", "unknown@example.com");
        log6.put("details", "Failed login attempt with invalid credentials");
        log6.put("timestamp", now.minusHours(8).format(formatter));
        log6.put("severity", "error");
        log6.put("ipAddress", "203.45.67.89");
        logs.add(log6);

        Map<String, Object> log7 = new HashMap<>();
        log7.put("id", 7);
        log7.put("action", "Database Maintenance");
        log7.put("user", "System");
        log7.put("details", "Scheduled database maintenance completed");
        log7.put("timestamp", now.minusHours(12).format(formatter));
        log7.put("severity", "info");
        log7.put("ipAddress", "127.0.0.1");
        logs.add(log7);

        Map<String, Object> log8 = new HashMap<>();
        log8.put("id", 8);
        log8.put("action", "Appointment Deleted");
        log8.put("user", "doctor@hospital.com");
        log8.put("details", "Appointment cancelled by Dr. Michael Chen");
        log8.put("timestamp", now.minusHours(24).format(formatter));
        log8.put("severity", "warning");
        log8.put("ipAddress", "192.168.1.105");
        logs.add(log8);

        return logs;
    }

    @GetMapping("/stats")
    public Map<String, Object> getAuditStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalLogs", 156);
        stats.put("todayLogs", 23);
        stats.put("errorLogs", 5);
        stats.put("warningLogs", 12);
        stats.put("infoLogs", 89);
        stats.put("successLogs", 50);
        
        return stats;
    }
}
