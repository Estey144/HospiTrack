package com.edigest.HospiTrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import com.edigest.HospiTrack.entity.Equipment;

@Service
public class EquipmentService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Equipment> equipmentRowMapper = (rs, rowNum) -> {
        Equipment equipment = new Equipment();
        equipment.setId(rs.getString("ID"));
        equipment.setEquipmentName(rs.getString("EQUIPMENT_NAME"));
        equipment.setEquipmentType(rs.getString("EQUIPMENT_TYPE"));
        equipment.setManufacturer(rs.getString("MANUFACTURER"));
        equipment.setModel(rs.getString("MODEL"));
        equipment.setCondition(rs.getString("CONDITION"));
        equipment.setPurchaseDate(rs.getString("PURCHASE_DATE"));
        equipment.setDepartmentId(rs.getString("DEPARTMENT_ID"));
        equipment.setBranchId(rs.getString("BRANCH_ID"));
        equipment.setStatus(rs.getString("STATUS"));
        equipment.setActive(rs.getBoolean("ACTIVE"));
        return equipment;
    };

    public List<Equipment> getAllEquipment() {
        try {
            String sql = "SELECT * FROM EQUIPMENT WHERE ACTIVE = 1 ORDER BY EQUIPMENT_NAME";
            return jdbcTemplate.query(sql, equipmentRowMapper);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching equipment: " + e.getMessage());
        }
    }

    public Equipment getEquipmentById(String id) {
        try {
            String sql = "SELECT * FROM EQUIPMENT WHERE ID = ? AND ACTIVE = 1";
            List<Equipment> results = jdbcTemplate.query(sql, equipmentRowMapper, id);
            return results.isEmpty() ? null : results.get(0);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching equipment by ID: " + e.getMessage());
        }
    }

    public Equipment saveEquipment(Equipment equipment) {
        try {
            if (equipment.getId() == null || equipment.getId().isEmpty()) {
                equipment.setId(generateEquipmentId());
            }
            
            String sql = "INSERT INTO EQUIPMENT (ID, EQUIPMENT_NAME, EQUIPMENT_TYPE, MANUFACTURER, " +
                        "MODEL, CONDITION, PURCHASE_DATE, DEPARTMENT_ID, BRANCH_ID, STATUS, ACTIVE) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                equipment.getId(),
                equipment.getEquipmentName(),
                equipment.getEquipmentType(),
                equipment.getManufacturer(),
                equipment.getModel(),
                equipment.getCondition(),
                equipment.getPurchaseDate(),
                equipment.getDepartmentId(),
                equipment.getBranchId(),
                equipment.getStatus(),
                equipment.getActive() != null ? equipment.getActive() : true
            );
            
            return equipment;
        } catch (DataAccessException e) {
            throw new RuntimeException("Error saving equipment: " + e.getMessage());
        }
    }

    public Equipment updateEquipment(Equipment equipment) {
        try {
            String sql = "UPDATE EQUIPMENT SET EQUIPMENT_NAME = ?, EQUIPMENT_TYPE = ?, " +
                        "MANUFACTURER = ?, MODEL = ?, CONDITION = ?, PURCHASE_DATE = ?, " +
                        "DEPARTMENT_ID = ?, BRANCH_ID = ?, STATUS = ?, ACTIVE = ? " +
                        "WHERE ID = ?";
            
            int rowsAffected = jdbcTemplate.update(sql,
                equipment.getEquipmentName(),
                equipment.getEquipmentType(),
                equipment.getManufacturer(),
                equipment.getModel(),
                equipment.getCondition(),
                equipment.getPurchaseDate(),
                equipment.getDepartmentId(),
                equipment.getBranchId(),
                equipment.getStatus(),
                equipment.getActive() != null ? equipment.getActive() : true,
                equipment.getId()
            );
            
            return rowsAffected > 0 ? equipment : null;
        } catch (DataAccessException e) {
            throw new RuntimeException("Error updating equipment: " + e.getMessage());
        }
    }

    public boolean deleteEquipment(String id) {
        try {
            // Soft delete - set active to false instead of actual deletion
            String sql = "UPDATE EQUIPMENT SET ACTIVE = 0 WHERE ID = ?";
            int rowsAffected = jdbcTemplate.update(sql, id);
            return rowsAffected > 0;
        } catch (DataAccessException e) {
            // Check if it's a foreign key constraint violation
            if (e.getMessage().contains("constraint") || e.getMessage().contains("foreign key")) {
                throw new RuntimeException("Cannot delete equipment: it is referenced by other records");
            }
            throw new RuntimeException("Error deleting equipment: " + e.getMessage());
        }
    }

    private String generateEquipmentId() {
        return "eq" + String.format("%03d", (int)(Math.random() * 1000));
    }
}
