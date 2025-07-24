package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.payload.MedicationDTO;
import com.edigest.HospiTrack.payload.PrescriptionResponseDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Service
public class PrescriptionService {

    private final JdbcTemplate jdbcTemplate;

    public PrescriptionService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static class PrescriptionRowMapper implements RowMapper<PrescriptionResponseDTO> {
        @Override
        public PrescriptionResponseDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            PrescriptionResponseDTO prescription = new PrescriptionResponseDTO();
            prescription.setId(rs.getString("id"));  // Prescription ID
            prescription.setAppointmentId(rs.getString("appointment_id"));
            prescription.setDoctorId(rs.getString("doctor_id"));
            prescription.setDoctorName(rs.getString("doctor_name"));  // Make sure your query includes this alias!
            prescription.setPatientId(rs.getString("patient_id"));
            prescription.setPatientName(rs.getString("patient_name")); // Make sure your query includes this alias!
            prescription.setNotes(rs.getString("notes"));
            prescription.setDateIssued(rs.getDate("date_issued").toLocalDate());
            prescription.setMedications(new ArrayList<>());
            return prescription;
        }
    }

    public List<PrescriptionResponseDTO> getByPatientId(String patientId) {
        // SQL with JOIN to get doctor and patient names by user_id
        String sqlPrescriptions =
                "SELECT p.id, p.appointment_id, p.doctor_id, p.patient_id, p.notes, p.date_issued, " +
                        "u_doc.name AS doctor_name, u_pat.name AS patient_name " +
                        "FROM Prescriptions p " +
                        "JOIN Doctors d ON p.doctor_id = d.id " +
                        "JOIN Users u_doc ON d.user_id = u_doc.id " +
                        "JOIN Patients pa ON p.patient_id = pa.id " +
                        "JOIN Users u_pat ON pa.user_id = u_pat.id " +
                        "WHERE p.patient_id = ?";

        List<PrescriptionResponseDTO> prescriptions = jdbcTemplate.query(sqlPrescriptions, new Object[]{patientId}, new PrescriptionRowMapper());

        if (prescriptions.isEmpty()) {
            return prescriptions;
        }

        List<String> prescriptionIds = new ArrayList<>();
        for (PrescriptionResponseDTO p : prescriptions) {
            prescriptionIds.add(p.getId());
        }

        String inSql = String.join(",", Collections.nCopies(prescriptionIds.size(), "?"));

        String sqlMedications =
                "SELECT pm.prescription_id, m.id AS med_id, m.medicine_name, m.dosage, m.duration " +
                        "FROM Pres_Med pm " +
                        "JOIN Medications m ON pm.medication_id = m.id " +
                        "WHERE pm.prescription_id IN (" + inSql + ")";

        List<Map<String, Object>> medRows = jdbcTemplate.queryForList(sqlMedications, prescriptionIds.toArray());

        Map<String, List<MedicationDTO>> medsByPrescription = new HashMap<>();
        for (Map<String, Object> row : medRows) {
            String presId = (String) row.get("prescription_id");

            MedicationDTO med = new MedicationDTO();
            med.setId((String) row.get("med_id"));
            med.setMedicineName((String) row.get("medicine_name"));
            med.setDosage((String) row.get("dosage"));
            med.setDuration((String) row.get("duration"));

            medsByPrescription.computeIfAbsent(presId, k -> new ArrayList<>()).add(med);
        }

        for (PrescriptionResponseDTO prescription : prescriptions) {
            prescription.setMedications(
                    medsByPrescription.getOrDefault(prescription.getId(), Collections.emptyList())
            );
        }

        return prescriptions;
    }
}
