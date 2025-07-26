package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.payload.BillDTO;
import com.edigest.HospiTrack.payload.BillItemDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class BillService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<BillDTO> getBillsByUserId(String userId) {
        String billSql = "SELECT b.id, b.patient_id, b.appointment_id, b.total_amount, b.status, b.issue_date, " +
                "u.name as doctor_name, a.type as appointment_type, d.name as department_name, a.appointment_date " +
                "FROM Bills b " +
                "JOIN Appointments a ON b.appointment_id = a.id " +
                "JOIN Doctors doc ON a.doctor_id = doc.id " +
                "JOIN Users u ON doc.user_id = u.id " +
                "JOIN Departments d ON doc.department_id = d.id " +
                "JOIN Patients p ON b.patient_id = p.id " +
                "WHERE p.user_id = ?";

        // Query bills for the user
        List<BillDTO> bills = jdbcTemplate.query(billSql, new Object[]{userId}, new BillDTORowMapper());

        // For each bill, fetch its items
        for (BillDTO bill : bills) {
            String itemSql = "SELECT id, bill_id, description, amount FROM Bill_Items WHERE bill_id = ?";
            List<BillItemDTO> items = jdbcTemplate.query(itemSql, new Object[]{bill.getId()}, new BillItemDTORowMapper());
            bill.setItems(items);
        }

        return bills;
    }

    // Maps SQL result to BillDTO
    private static class BillDTORowMapper implements RowMapper<BillDTO> {
        @Override
        public BillDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            BillDTO bill = new BillDTO();
            bill.setId(rs.getString("id"));
            bill.setPatientId(rs.getString("patient_id"));
            bill.setAppointmentId(rs.getString("appointment_id"));
            bill.setTotalAmount(rs.getDouble("total_amount"));
            bill.setStatus(rs.getString("status"));
            bill.setIssueDate(rs.getDate("issue_date"));
            bill.setDoctorName(rs.getString("doctor_name"));
            bill.setAppointmentType(rs.getString("appointment_type"));
            bill.setDepartment(rs.getString("department_name"));
            bill.setVisitDate(rs.getDate("appointment_date"));
            return bill;
        }
    }

    // Maps SQL result to BillItemDTO
    private static class BillItemDTORowMapper implements RowMapper<BillItemDTO> {
        @Override
        public BillItemDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            BillItemDTO item = new BillItemDTO();
            item.setId(rs.getString("id"));
            item.setBillId(rs.getString("bill_id"));
            item.setDescription(rs.getString("description"));
            item.setAmount(rs.getDouble("amount"));
            return item;
        }
    }
}
