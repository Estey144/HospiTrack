package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.Feedback;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
            String insertSql = "INSERT INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?)";
            insertFeedbackStmt = connection.prepareStatement(insertSql);
            insertFeedbackStmt.setString(1, UUID.randomUUID().toString());
            insertFeedbackStmt.setString(2, patientId);
            insertFeedbackStmt.setString(3, feedback.getTargetType());
            insertFeedbackStmt.setString(4, feedback.getTargetId());
            insertFeedbackStmt.setInt(5, feedback.getRating());
            insertFeedbackStmt.setString(6, feedback.getComments());
            insertFeedbackStmt.setDate(7, new java.sql.Date(new Date().getTime()));

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

    public List<Feedback> getAllFeedback() {
        List<Feedback> feedbackList = new ArrayList<>();
        Connection connection = null;
        PreparedStatement stmt = null;
        ResultSet resultSet = null;

        try {
            connection = dataSource.getConnection();
            // Join with Patients and Users tables to get actual patient names
            String sql = "SELECT f.id, f.patient_id, f.target_type, f.target_id, " +
                        "f.rating, f.comments, f.date_submitted, u.name as patient_name " +
                        "FROM Feedback f " +
                        "JOIN Patients p ON f.patient_id = p.id " +
                        "JOIN Users u ON p.user_id = u.id " +
                        "ORDER BY f.date_submitted DESC";
            
            stmt = connection.prepareStatement(sql);
            resultSet = stmt.executeQuery();

            while (resultSet.next()) {
                Feedback feedback = new Feedback();
                feedback.setId(resultSet.getString("id"));
                feedback.setPatientId(resultSet.getString("patient_id"));
                feedback.setTargetType(resultSet.getString("target_type"));
                feedback.setTargetId(resultSet.getString("target_id"));
                feedback.setRating(resultSet.getInt("rating"));
                feedback.setComments(resultSet.getString("comments"));
                feedback.setDateSubmitted(resultSet.getDate("date_submitted"));
                
                // Get actual patient name from the joined query
                String patientName = resultSet.getString("patient_name");
                feedback.setPatientName(patientName != null ? patientName : "Anonymous Patient");
                feedback.setTargetName("Unknown Target"); // Default value since no target_name column
                
                feedbackList.add(feedback);
            }

        } catch (SQLException e) {
            // Log error but return empty list instead of throwing exception
            System.err.println("Error retrieving feedback: " + e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                if (resultSet != null) resultSet.close();
                if (stmt != null) stmt.close();
                if (connection != null) connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return feedbackList;
    }
}
