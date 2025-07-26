package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.payload.MedicalRecordDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;

@Service
public class MedicalRecordService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Fetch all medical records (admin/testing)
    public List<MedicalRecordDTO> getAllMedicalRecords() {
        String sql = "SELECT a.id, a.appointment_date, a.type, " +
                "u.name AS doctor_name, d.name AS department, " +
                "p.notes, p.notes AS diagnosis " +
                "FROM Appointments a " +
                "JOIN Doctors doc ON a.doctor_id = doc.id " +
                "JOIN Users u ON doc.user_id = u.id " +
                "JOIN Departments d ON doc.department_id = d.id " +
                "LEFT JOIN Prescriptions p ON a.id = p.appointment_id";

        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRowToMedicalRecordDTO(rs));
    }

    public List<MedicalRecordDTO> getMedicalRecordsByUserId(String userId) {
        System.out.println("Fetching medical records for userId: " + userId);

        // Step 1: Get patientId using userId
        String patientSql = "SELECT id FROM Patients WHERE user_id = ?";
        List<String> patientIds = jdbcTemplate.query(patientSql, new Object[]{userId},
                (rs, rowNum) -> rs.getString("id"));

        System.out.println("Found patient IDs: " + patientIds);

        if (patientIds.isEmpty()) {
            System.out.println("No patient found for userId: " + userId);
            return Collections.emptyList();
        }

        String patientId = patientIds.get(0);
        System.out.println("Using patientId: " + patientId);

        // Step 2: Fetch medical records for patientId
        String sql = "SELECT a.id, a.appointment_date, a.type, " +
                "u.name AS doctor_name, d.name AS department, " +
                "pr.notes, pr.notes AS diagnosis " +
                "FROM Appointments a " +
                "JOIN Doctors doc ON a.doctor_id = doc.id " +
                "JOIN Users u ON doc.user_id = u.id " +
                "JOIN Departments d ON doc.department_id = d.id " +
                "LEFT JOIN Prescriptions pr ON a.id = pr.appointment_id " +
                "WHERE a.patient_id = ?";

        List<MedicalRecordDTO> records = jdbcTemplate.query(sql, new Object[]{patientId},
                (rs, rowNum) -> mapRowToMedicalRecordDTO(rs));

        System.out.println("Fetched records count: " + records.size());

        return records;
    }

    // Helper method to map ResultSet row to MedicalRecordDTO
    private MedicalRecordDTO mapRowToMedicalRecordDTO(ResultSet rs) throws SQLException {
        MedicalRecordDTO record = new MedicalRecordDTO();
        record.setId(rs.getString("id"));
        if(rs.getDate("appointment_date") != null) {
            record.setDate(rs.getDate("appointment_date").toString());
        } else {
            record.setDate("Unknown Date");
        }
        record.setType(rs.getString("type"));
        record.setDoctorName(rs.getString("doctor_name"));
        record.setDepartment(rs.getString("department"));
        record.setNotes(rs.getString("notes"));
        record.setDiagnosis(rs.getString("diagnosis") != null ? rs.getString("diagnosis") : "Not Available");
        return record;
    }
}
