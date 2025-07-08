package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private JdbcTemplate jdbc;

    // 🔸 RAW SQL: Get all doctors
    public List<Doctor> getAllDoctors() {
        String sql = "SELECT * FROM Doctors"; // <-- RAW SQL HERE
        return jdbc.query(sql, new BeanPropertyRowMapper<>(Doctor.class));
    }

    // 🔸 RAW SQL: Get doctor by ID
    public Doctor getDoctorById(String id) {
        String sql = "SELECT * FROM Doctors WHERE id = ?"; // <-- RAW SQL HERE
        List<Doctor> result = jdbc.query(sql, new BeanPropertyRowMapper<>(Doctor.class), id);
        return result.isEmpty() ? null : result.get(0);
    }

    // 🔸 RAW SQL: Insert a new doctor
    public Doctor saveDoctor(Doctor doctor) {
        String sql = "INSERT INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)"; // <-- RAW SQL HERE
        jdbc.update(sql,
                doctor.getId(),
                doctor.getUserId(),
                doctor.getBranchId(),
                doctor.getLicenseNumber(),
                doctor.getExperienceYears(),
                doctor.getAvailableHours(),
                doctor.getDepartmentId()
        );
        return doctor;
    }

    // 🔸 RAW SQL: Delete doctor by ID
    public void deleteDoctor(String id) {
        String sql = "DELETE FROM Doctors WHERE id = ?"; // <-- RAW SQL HERE
        jdbc.update(sql, id);
    }
    public int count() {
        String sql = "SELECT COUNT(*) FROM Doctors";  // Adjust table name as per your DB
        Integer count = jdbc.queryForObject(sql, Integer.class);
        return (count != null) ? count : 0;
    }

}
