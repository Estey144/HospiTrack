package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

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
    public int countDoctors() {
        String sql = "SELECT COUNT(*) FROM Users WHERE role = 'doctor'";
        Integer count = jdbc.queryForObject(sql, Integer.class);
        return (count != null) ? count : 0;
    }
    public List<Map<String, Object>> getAllDoctorsForFrontend() {
        String sql = """
            SELECT d.id AS doctorId,
                   u.name AS doctorName,
                   d.experience_years AS experienceYears,
                   d.license_number AS licenseNumber,
                   d.available_hours AS availableHours,
                   dep.name AS specialization,
                   hb.name AS branchName
            FROM Doctors d
            JOIN Users u ON d.user_id = u.id
            JOIN Departments dep ON d.department_id = dep.id
            JOIN Hospital_Branches hb ON d.branch_id = hb.id
        """;

        return jdbc.queryForList(sql);
    }
}
