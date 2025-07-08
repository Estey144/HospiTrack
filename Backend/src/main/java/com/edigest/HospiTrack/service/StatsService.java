package com.edigest.HospiTrack.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    @Autowired
    private JdbcTemplate jdbc;

    public int countDoctors() {
        String sql = "SELECT COUNT(*) FROM Users WHERE LOWER(role) = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, "doctor");
        System.out.println("Doctors Count: " + count);
        return (count != null) ? count : 0;
    }


    public int countPatients() {
        String sql = "SELECT COUNT(*) FROM Users WHERE LOWER(role) =?";
        Integer count = jdbc.queryForObject(sql, Integer.class, "patient");
        return (count != null) ? count : 0;
    }



    public int countBranches() {
        String sql = "SELECT COUNT(*) FROM Hospital_Branches";
        Integer count = jdbc.queryForObject(sql, Integer.class);
        return (count != null) ? count : 0;
    }
}
