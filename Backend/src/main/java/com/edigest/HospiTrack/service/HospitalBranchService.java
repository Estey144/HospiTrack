package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.HospitalBranch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class HospitalBranchService {

    @Autowired
    private JdbcTemplate jdbc;

    // 🔸 RAW SQL: Insert a hospital branch
    public HospitalBranch saveBranch(HospitalBranch branch) {
        String sql = "INSERT INTO Hospital_Branches (id, name, address, established_date) VALUES (?, ?, ?, ?)"; // <-- RAW SQL HERE
        jdbc.update(sql,
                branch.getId(),
                branch.getName(),
                branch.getAddress(),
                (branch.getEstablishedDate() != null ? new Date(branch.getEstablishedDate().getTime()) : null)
        );
        return branch;
    }

    // 🔸 RAW SQL: Get all branches
    public List<HospitalBranch> getAllBranches() {
        String sql = "SELECT * FROM Hospital_Branches"; // <-- RAW SQL HERE
        return jdbc.query(sql, new BeanPropertyRowMapper<>(HospitalBranch.class));
    }

    // 🔸 RAW SQL: Get branch by ID
    public HospitalBranch getBranchById(String id) {
        String sql = "SELECT * FROM Hospital_Branches WHERE id = ?"; // <-- RAW SQL HERE
        List<HospitalBranch> branches = jdbc.query(sql, new BeanPropertyRowMapper<>(HospitalBranch.class), id);
        return branches.isEmpty() ? null : branches.get(0);
    }

    // 🔸 RAW SQL: Delete branch by ID
    public void deleteBranch(String id) {
        String sql = "DELETE FROM Hospital_Branches WHERE id = ?"; // <-- RAW SQL HERE
        jdbc.update(sql, id);
    }

    public int count() {
        String sql = "SELECT COUNT(*) FROM Hospital_Branches"; // Adjust table name if needed
        Integer count = jdbc.queryForObject(sql, Integer.class);
        return (count != null) ? count : 0;
    }
}
