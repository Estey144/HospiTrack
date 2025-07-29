package com.edigest.HospiTrack.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edigest.HospiTrack.payload.LabTestDTO;

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

    public List<LabTestDTO> getAllLabTests() throws SQLException {
        List<LabTestDTO> tests = new ArrayList<>();

        try (Connection conn = dataSource.getConnection()) {
            String labTestSql = "SELECT lt.id, lt.test_type, lt.test_date, lt.result, lt.file_url, " +
                    "u.name as doctor_name, p_user.name as patient_name " +
                    "FROM Lab_Tests lt " +
                    "LEFT JOIN Doctors d ON lt.doctor_id = d.id " +
                    "LEFT JOIN Users u ON d.user_id = u.id " +
                    "LEFT JOIN Patients p ON lt.patient_id = p.id " +
                    "LEFT JOIN Users p_user ON p.user_id = p_user.id " +
                    "ORDER BY lt.test_date DESC";

            try (PreparedStatement ps = conn.prepareStatement(labTestSql)) {
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        LabTestDTO test = new LabTestDTO();
                        test.setId(rs.getString("id"));
                        test.setTestType(rs.getString("test_type"));
                        test.setTestDate(rs.getDate("test_date").toString());
                        test.setResult(rs.getString("result"));
                        test.setFileUrl(rs.getString("file_url"));
                        test.setDoctorName(rs.getString("doctor_name"));
                        test.setPatientName(rs.getString("patient_name"));
                        tests.add(test);
                    }
                }
            }
        }

        return tests;
    }
}
