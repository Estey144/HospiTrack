package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.payload.LabTestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class LabTestService {

    private final DataSource dataSource;

    @Autowired
    public LabTestService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<LabTestDTO> getLabTestsByUserId(String userId) throws SQLException {
        List<LabTestDTO> tests = new ArrayList<>();

        try (Connection conn = dataSource.getConnection()) {
            // Step 1: Get patient id from user id
            String getPatientIdSql = "SELECT id FROM Patients WHERE user_id = ?";
            String patientId = null;
            try (PreparedStatement ps = conn.prepareStatement(getPatientIdSql)) {
                ps.setString(1, userId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        patientId = rs.getString("id");
                    } else {
                        // no patient found for userId
                        return tests;
                    }
                }
            }

            // Step 2: Fetch lab tests for this patient
            String labTestSql = "SELECT lt.id, lt.test_type, lt.test_date, lt.result, lt.file_url, u.name as doctor_name " +
                    "FROM Lab_Tests lt " +
                    "LEFT JOIN Doctors d ON lt.doctor_id = d.id " +
                    "LEFT JOIN Users u ON d.user_id = u.id " +
                    "WHERE lt.patient_id = ?";

            try (PreparedStatement ps = conn.prepareStatement(labTestSql)) {
                ps.setString(1, patientId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        LabTestDTO test = new LabTestDTO();
                        test.setId(rs.getString("id"));
                        test.setTestType(rs.getString("test_type"));
                        test.setTestDate(rs.getDate("test_date").toString());
                        test.setResult(rs.getString("result"));
                        test.setFileUrl(rs.getString("file_url"));
                        test.setDoctorName(rs.getString("doctor_name"));
                        tests.add(test);
                    }
                }
            }
        }

        return tests;
    }
}
