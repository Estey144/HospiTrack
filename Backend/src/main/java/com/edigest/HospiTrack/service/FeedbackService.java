package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.Feedback;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.UUID;

@Service
public class FeedbackService {

    private final DataSource dataSource;

    public FeedbackService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void submitFeedback(Feedback feedback) {
        Connection connection = null;
        PreparedStatement getPatientIdStmt = null;
        PreparedStatement insertFeedbackStmt = null;
        ResultSet resultSet = null;

        try {
            connection = dataSource.getConnection();

            // Step 1: Map user.id to patient.id
            String sqlGetPatientId = "SELECT id FROM Patients WHERE user_id = ?";
            getPatientIdStmt = connection.prepareStatement(sqlGetPatientId);
            getPatientIdStmt.setString(1, feedback.getPatientId());
            resultSet = getPatientIdStmt.executeQuery();

            String patientId = null;
            if (resultSet.next()) {
                patientId = resultSet.getString("id");
            }

            if (patientId == null) {
                throw new RuntimeException("Patient not found for user ID: " + feedback.getPatientId());
            }

            // Step 2: Insert feedback with real patientId
            String insertSql = "INSERT INTO Feedback (id, patient_id, target_type, target_id, target_name, rating, comments, date_submitted) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            insertFeedbackStmt = connection.prepareStatement(insertSql);
            insertFeedbackStmt.setString(1, UUID.randomUUID().toString());
            insertFeedbackStmt.setString(2, patientId);
            insertFeedbackStmt.setString(3, feedback.getTargetType());
            insertFeedbackStmt.setString(4, feedback.getTargetId());
            insertFeedbackStmt.setString(5, feedback.getTargetName());
            insertFeedbackStmt.setInt(6, feedback.getRating());
            insertFeedbackStmt.setString(7, feedback.getComments());
            insertFeedbackStmt.setDate(8, new java.sql.Date(new Date().getTime()));

            insertFeedbackStmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Error submitting feedback", e);
        } finally {
            try {
                if (resultSet != null) resultSet.close();
                if (getPatientIdStmt != null) getPatientIdStmt.close();
                if (insertFeedbackStmt != null) insertFeedbackStmt.close();
                if (connection != null) connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
