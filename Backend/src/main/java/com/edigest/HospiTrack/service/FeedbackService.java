package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.Feedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private JdbcTemplate jdbc;

    public List<Feedback> getPositiveFeedback() {
        String sql = "SELECT * FROM Feedback WHERE rating >= 4 AND comments IS NOT NULL ORDER BY date_submitted DESC FETCH FIRST 20 ROWS ONLY";

        return jdbc.query(sql, new RowMapper<Feedback>() {
            @Override
            public Feedback mapRow(ResultSet rs, int rowNum) throws SQLException {
                Feedback fb = new Feedback();
                fb.setId(rs.getString("id"));
                fb.setPatientId(rs.getString("patient_id"));
                fb.setTargetType(rs.getString("target_type"));
                fb.setTargetId(rs.getString("target_id"));
                fb.setRating(rs.getInt("rating"));
                fb.setComments(rs.getString("comments"));
                fb.setDateSubmitted(rs.getDate("date_submitted"));
                return fb;
            }
        });
    }
}