package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private JdbcTemplate jdbc;

    // 🔸 RAW SQL: Get all departments
    public List<Department> getAll() {
        String sql = "SELECT * FROM Departments"; // <-- RAW SQL HERE
        return jdbc.query(sql, new BeanPropertyRowMapper<>(Department.class));
    }

    // 🔸 RAW SQL: Get department by ID
    public Department getById(String id) {
        String sql = "SELECT * FROM Departments WHERE id = ?"; // <-- RAW SQL HERE
        List<Department> departments = jdbc.query(sql, new BeanPropertyRowMapper<>(Department.class), id);
        return departments.isEmpty() ? null : departments.get(0);
    }

    // 🔸 RAW SQL: Insert department
    public Department save(Department department) {
        String sql = "INSERT INTO Departments (id, name, description) VALUES (?, ?, ?)"; // <-- RAW SQL HERE
        jdbc.update(sql,
                department.getId(),
                department.getName(),
                department.getDescription()
        );
        return department;
    }

    // 🔸 RAW SQL: Delete department by ID
    public void delete(String id) {
        String sql = "DELETE FROM Departments WHERE id = ?"; // <-- RAW SQL HERE
        jdbc.update(sql, id);
    }
}
