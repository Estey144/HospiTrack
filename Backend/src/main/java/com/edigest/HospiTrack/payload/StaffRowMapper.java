package com.edigest.HospiTrack.payload;


import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class StaffRowMapper implements RowMapper<StaffDTO> {
    @Override
    public StaffDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        StaffDTO dto = new StaffDTO();
        dto.setId(rs.getString("id"));
        dto.setName(rs.getString("name"));
        dto.setEmail(rs.getString("email"));
        dto.setContact(rs.getString("phone"));
        dto.setPosition(rs.getString("designation"));
        dto.setDepartment(rs.getString("department"));
        dto.setLocation(rs.getString("location"));
        return dto;
    }
}

