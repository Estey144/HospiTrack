package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.BranchContact;
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


    public HospitalBranch saveBranch(HospitalBranch branch) {
        String sql = "INSERT INTO Hospital_Branches (id, name, address, established_date) VALUES (?, ?, ?, ?)";
        jdbc.update(sql,
                branch.getId(),
                branch.getName(),
                branch.getAddress(),
                (branch.getEstablishedDate() != null ? new Date(branch.getEstablishedDate().getTime()) : null)
        );

        if (branch.getContacts() != null) {
            for (BranchContact contact : branch.getContacts()) {
                String contactSql = "INSERT INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES (?, ?, ?, ?)";
                jdbc.update(contactSql,
                        contact.getId(),
                        branch.getId(),
                        contact.getContactNumber(),
                        contact.getType()
                );
            }
        }

        return branch;
    }


    public List<HospitalBranch> getAllBranches() {
        String sql = "SELECT * FROM Hospital_Branches";
        List<HospitalBranch> branches = jdbc.query(sql, new BeanPropertyRowMapper<>(HospitalBranch.class));
        for (HospitalBranch branch : branches) {
            branch.setContacts(getContactsByBranchId(branch.getId()));
        }
        return branches;
    }


    public HospitalBranch getBranchById(String id) {
        String sql = "SELECT * FROM Hospital_Branches WHERE id = ?";
        List<HospitalBranch> branches = jdbc.query(sql, new BeanPropertyRowMapper<>(HospitalBranch.class), id);
        if (!branches.isEmpty()) {
            HospitalBranch branch = branches.get(0);
            branch.setContacts(getContactsByBranchId(id));
            return branch;
        }
        return null;
    }


    public void deleteBranch(String id) {
        String deleteContactsSql = "DELETE FROM Branch_Contacts WHERE branch_id = ?";
        jdbc.update(deleteContactsSql, id);

        String sql = "DELETE FROM Hospital_Branches WHERE id = ?";
        jdbc.update(sql, id);
    }


    public int countBranches() {
        String sql = "SELECT COUNT(*) FROM Hospital_Branches";
        Integer count = jdbc.queryForObject(sql, Integer.class);
        return (count != null) ? count : 0;
    }


    private List<BranchContact> getContactsByBranchId(String branchId) {
        String sql = "SELECT * FROM Branch_Contacts WHERE branch_id = ?";
        return jdbc.query(sql, new BeanPropertyRowMapper<>(BranchContact.class), branchId);
    }
}