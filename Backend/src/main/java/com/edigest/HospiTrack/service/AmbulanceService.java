package com.edigest.HospiTrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.edigest.HospiTrack.entity.Ambulance;

@Service
public class AmbulanceService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Ambulance> getAllAmbulances() {
        String sql = "SELECT id, vehicle_number as vehicleNumber, status, location, branch_id as branchId FROM Ambulances";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Ambulance.class));
    }

    public Ambulance getAmbulanceById(String id) {
        String sql = "SELECT id, vehicle_number as vehicleNumber, status, location, branch_id as branchId FROM Ambulances WHERE id = ?";
        List<Ambulance> ambulances = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Ambulance.class), id);
        return ambulances.isEmpty() ? null : ambulances.get(0);
    }

    public Ambulance saveAmbulance(Ambulance ambulance) {
        if (ambulance.getId() != null && getAmbulanceById(ambulance.getId()) != null) {
            // Update existing ambulance
            String sql = "UPDATE Ambulances SET vehicle_number = ?, status = ?, location = ?, branch_id = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    ambulance.getVehicleNumber(),
                    ambulance.getStatus(),
                    ambulance.getLocation(),
                    ambulance.getBranchId(),
                    ambulance.getId()
            );
        } else {
            // Insert new ambulance
            String sql = "INSERT INTO Ambulances (id, vehicle_number, status, location, branch_id) VALUES (?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                    ambulance.getId(),
                    ambulance.getVehicleNumber(),
                    ambulance.getStatus(),
                    ambulance.getLocation(),
                    ambulance.getBranchId()
            );
        }
        return ambulance;
    }

    public void deleteAmbulance(String id) {
        String sql = "DELETE FROM Ambulances WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
