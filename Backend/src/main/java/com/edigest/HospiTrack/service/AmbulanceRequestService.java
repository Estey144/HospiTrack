package com.edigest.HospiTrack.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AmbulanceRequestService {

    private final JdbcTemplate jdbcTemplate;

    public AmbulanceRequestService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String createAmbulanceRequest(String userId, String pickupLocation, String dropLocation, LocalDateTime requestedTime) {
        // 1. Find patient_id from user_id
        String patientId = jdbcTemplate.queryForObject(
                "SELECT id FROM Patients WHERE user_id = ?",
                new Object[]{userId},
                String.class
        );

        if (patientId == null) {
            throw new RuntimeException("No patient found for user ID: " + userId);
        }

        // 2. Try to assign an available ambulance
        String ambulanceId;
        try {
            ambulanceId = jdbcTemplate.queryForObject(
                    "SELECT id FROM Ambulances WHERE status = 'Available' AND ROWNUM = 1",
                    String.class
            );
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("All ambulances are currently busy. Please try again later.");
        }

        // 3. Generate UUID
        String requestId = UUID.randomUUID().toString();
        LocalDateTime finalTime = (requestedTime != null) ? requestedTime : LocalDateTime.now();

        // 4. Insert request
        int rows = jdbcTemplate.update(
                "INSERT INTO Ambulance_Requests (id, patient_id, ambulance_id, request_time, pickup_location, drop_location, status) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?)",
                requestId,
                patientId,
                ambulanceId,
                Timestamp.valueOf(finalTime),
                pickupLocation,
                dropLocation,
                "pending"
        );

        if (rows == 1) {
            return requestId;
        } else {
            throw new RuntimeException("Failed to insert ambulance request");
        }
    }
    public List<Map<String, Object>> getRequestsByUserId(String userId) {
        String sql = """
        SELECT ar.*, a.vehicle_number, a.status AS ambulance_status
        FROM Ambulance_Requests ar
        LEFT JOIN Ambulances a ON ar.ambulance_id = a.id
        WHERE ar.patient_id = (SELECT id FROM Patients WHERE user_id = ?)
        ORDER BY ar.request_time DESC
        """;

        return jdbcTemplate.queryForList(sql, userId);
    }

    public List<Map<String, Object>> getAllRequests() {
        String sql = """
        SELECT ar.*, a.vehicle_number, a.status AS ambulance_status,
               p.dob as patient_dob, u.name as patient_name, u.phone as patient_phone
        FROM Ambulance_Requests ar
        LEFT JOIN Ambulances a ON ar.ambulance_id = a.id
        LEFT JOIN Patients p ON ar.patient_id = p.id
        LEFT JOIN Users u ON p.user_id = u.id
        ORDER BY ar.request_time DESC
        """;

        return jdbcTemplate.queryForList(sql);
    }

}
