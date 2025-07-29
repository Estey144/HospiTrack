package com.edigest.HospiTrack.service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.edigest.HospiTrack.entity.Users;

@Service
public class UsersService {

    @Autowired
    private JdbcTemplate jdbc;

    // Find user by email (for login)
    public Users findByEmail(String email) {
        String sql = "SELECT * FROM Users WHERE email = ?";
        List<Users> users = jdbc.query(sql, new BeanPropertyRowMapper<>(Users.class), email);
        return users.isEmpty() ? null : users.get(0);
    }

    public List<Users> getAll() {
        String sql = "SELECT * FROM Users";
        return jdbc.query(sql, new BeanPropertyRowMapper<>(Users.class));
    }

    public Users getById(String id) {
        String sql = "SELECT * FROM Users WHERE id = ?";
        List<Users> users = jdbc.query(sql, new BeanPropertyRowMapper<>(Users.class), id);
        return users.isEmpty() ? null : users.get(0);
    }

    public Users save(Users user) {
        if (user.getId() != null && getById(user.getId()) != null) {
            // Update existing user
            String sql = "UPDATE Users SET name = ?, email = ?, password = ?, phone = ?, role = ? WHERE id = ?";
            jdbc.update(sql,
                    user.getName(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getPhone(),
                    user.getRole(),
                    user.getId()
            );
        } else {
            // Insert new user
            String sql = "INSERT INTO Users (id, name, email, password, phone, created_at, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
            Date now = new Date();
            jdbc.update(sql,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getPhone(),
                    new Timestamp(now.getTime()),
                    user.getRole()
            );
            user.setCreatedAt(now);
        }
        return user;
    }

    public void delete(String id) {
        String sql = "DELETE FROM Users WHERE id = ?";
        jdbc.update(sql, id);
    }
}
