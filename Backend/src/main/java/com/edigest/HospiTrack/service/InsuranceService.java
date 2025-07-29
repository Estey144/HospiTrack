package com.edigest.HospiTrack.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.edigest.HospiTrack.payload.BenefitDTO;
import com.edigest.HospiTrack.payload.ClaimDTO;
import com.edigest.HospiTrack.payload.InsuranceProviderDTO;
import com.edigest.HospiTrack.payload.PatientInsuranceDTO;

@Service
public class InsuranceService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Helper method to convert user_id to patient_id
    private String convertUserIdToPatientId(String userId) {
        System.out.println("Service: Converting user_id " + userId + " to patient_id");
        try {
            String sql = "SELECT p.id FROM Patients p WHERE p.user_id = ?";
            String patientId = jdbcTemplate.queryForObject(sql, String.class, userId);
            System.out.println("Service: Successfully converted user_id " + userId + " to patient_id " + patientId);
            return patientId;
        } catch (Exception e) {
            System.out.println("Service: ERROR - No patient record found for user_id: " + userId);
            System.out.println("Service: Exception details: " + e.getMessage());
            
            // Create a helpful error message for the frontend
            throw new RuntimeException("Patient profile not found. Please contact administration to set up your patient profile before accessing insurance services.");
        }
    }

    // Helper method to check if user has patient record (non-blocking)
    private boolean hasPatientRecord(String userId) {
        try {
            String sql = "SELECT COUNT(*) FROM Patients p WHERE p.user_id = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId);
            return count != null && count > 0;
        } catch (Exception e) {
            System.out.println("Service: Error checking patient record for user: " + userId);
            return false;
        }
    }

    public List<PatientInsuranceDTO> getInsurancePlans(String userId) {
        try {
            // Convert user_id to patient_id
            String patientId = convertUserIdToPatientId(userId);
            
            String sql = "SELECT pi.id, pi.patient_id, pi.provider_id, ip.name AS providerName, " +
                    "pi.policy_number, pi.coverage_details " +
                    "FROM Patient_Insurance pi " +
                    "JOIN Insurance_Providers ip ON pi.provider_id = ip.id " +
                    "WHERE pi.patient_id = ?";
            
            List<PatientInsuranceDTO> plans = jdbcTemplate.query(sql, new Object[]{patientId}, (rs, rowNum) -> {
                PatientInsuranceDTO dto = new PatientInsuranceDTO();
                dto.setId(rs.getString("id"));
                dto.setPatientId(rs.getString("patient_id"));
                dto.setProviderId(rs.getString("provider_id"));
                dto.setProviderName(rs.getString("providerName"));
                dto.setPolicyNumber(rs.getString("policy_number"));
                dto.setCoverageDetails(rs.getString("coverage_details"));
                return dto;
            });
            
            return plans;
        } catch (Exception e) {
            // Return empty list to allow page to load
            return new ArrayList<>();
        }
    }

    public List<ClaimDTO> getClaimsForPatient(String userId) {
        System.out.println("Service: Getting claims for user: " + userId);
        
        try {
            // Convert user_id to patient_id
            String patientId = convertUserIdToPatientId(userId);
            
            String sql = "SELECT c.id, c.claim_status, c.claim_amount, " +
                    "TO_CHAR(c.submitted_on, 'YYYY-MM-DD') as submitted_on, " +
                    "COALESCE(u.name, 'Unknown Provider') as provider, " +
                    "'Medical Service' as service, " +
                    "COALESCE(c.claim_amount * 0.8, 0) as paid, " +
                    "COALESCE(c.claim_amount * 0.8, 0) as approved, " +
                    "COALESCE(c.claim_amount * 0.2, 0) as patientResponsibility, " +
                    "'Primary Insurance' as insurancePlan " +
                    "FROM Claims c " +
                    "JOIN Appointments a ON c.appointment_id = a.id " +
                    "LEFT JOIN Doctors d ON a.doctor_id = d.id " +
                    "LEFT JOIN Users u ON d.user_id = u.id " +
                    "WHERE a.patient_id = ? " +
                    "ORDER BY c.submitted_on DESC";
            
            List<ClaimDTO> claims = jdbcTemplate.query(sql, new Object[]{patientId}, (rs, rowNum) -> {
                ClaimDTO dto = new ClaimDTO();
                dto.setId(rs.getString("id"));
                dto.setClaimStatus(rs.getString("claim_status"));
                dto.setClaimAmount(rs.getDouble("claim_amount"));
                dto.setSubmittedOn(rs.getString("submitted_on"));
                dto.setProvider(rs.getString("provider"));
                dto.setService(rs.getString("service"));
                dto.setPaid(rs.getDouble("paid"));
                dto.setApproved(rs.getDouble("approved"));
                dto.setPatientResponsibility(rs.getDouble("patientResponsibility"));
                dto.setInsurancePlan(rs.getString("insurancePlan"));
                return dto;
            });
            
            System.out.println("Service: Found " + claims.size() + " claims for patient: " + patientId);
            return claims;
        } catch (Exception e) {
            System.out.println("Service: Error getting claims for user " + userId + ": " + e.getMessage());
            // Return empty list to allow page to load
            return new ArrayList<>();
        }
    }

    public List<InsuranceProviderDTO> getAllInsuranceProviders() {
        System.out.println("Getting all insurance providers");
        String sql = "SELECT id, name, contact_info FROM Insurance_Providers";
        List<InsuranceProviderDTO> providers = jdbcTemplate.query(sql, (rs, rowNum) -> {
            InsuranceProviderDTO dto = new InsuranceProviderDTO();
            dto.setId(rs.getString("id"));
            dto.setName(rs.getString("name"));
            dto.setContactInfo(rs.getString("contact_info"));
            return dto;
        });
        
        System.out.println("Found " + providers.size() + " insurance providers");
        return providers;
    }

    public PatientInsuranceDTO addInsurancePlan(PatientInsuranceDTO dto) {
        System.out.println("Service: Adding insurance plan for user: " + dto.getPatientId());
        
        // Convert user_id to patient_id
        String actualPatientId = convertUserIdToPatientId(dto.getPatientId());
        
        String newId = UUID.randomUUID().toString();
        String sql = "INSERT INTO Patient_Insurance (id, patient_id, provider_id, policy_number, coverage_details) " +
                "VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                newId,
                actualPatientId,  // Use the actual patient_id from the database
                dto.getProviderId(),
                dto.getPolicyNumber(),
                dto.getCoverageDetails());

        System.out.println("Service: Successfully added insurance plan with ID: " + newId + " for patient: " + actualPatientId);
        // Return the created plan with ID
        dto.setId(newId);
        return dto;
    }

    public List<BenefitDTO> getBenefitsForPatient(String userId) {
        System.out.println("Service: Getting benefits for user: " + userId);
        
        try {
            // Convert user_id to patient_id (for future use with dynamic benefits)
            String patientId = convertUserIdToPatientId(userId);
            System.out.println("Service: Converted to patient_id: " + patientId + " for benefits lookup");
        } catch (Exception e) {
            System.out.println("Service: Warning - No patient record for user " + userId + ", returning default benefits");
        }
        
        // For now, return static benefits data (works regardless of patient record)
        // You can later implement dynamic benefits based on patient's insurance plans
        List<BenefitDTO> benefits = new ArrayList<>();

        // Medical Services Category
        BenefitDTO medicalCategory = new BenefitDTO();
        medicalCategory.setCategory("Medical Services");
        List<BenefitDTO.BenefitItem> medicalItems = new ArrayList<>();
        medicalItems.add(new BenefitDTO.BenefitItem("Primary Care Visits", "80% after deductible", "$25"));
        medicalItems.add(new BenefitDTO.BenefitItem("Specialist Visits", "80% after deductible", "$50"));
        medicalItems.add(new BenefitDTO.BenefitItem("Emergency Room", "80% after deductible", "$200"));
        medicalItems.add(new BenefitDTO.BenefitItem("Urgent Care", "80% after deductible", "$75"));
        medicalItems.add(new BenefitDTO.BenefitItem("Preventive Care", "100%", "$0"));
        medicalItems.add(new BenefitDTO.BenefitItem("Laboratory Tests", "80% after deductible", "Varies"));
        medicalItems.add(new BenefitDTO.BenefitItem("Imaging (X-ray, MRI)", "80% after deductible", "Varies"));
        medicalCategory.setItems(medicalItems);
        benefits.add(medicalCategory);

        // Prescription Drugs Category
        BenefitDTO prescriptionCategory = new BenefitDTO();
        prescriptionCategory.setCategory("Prescription Drugs");
        List<BenefitDTO.BenefitItem> prescriptionItems = new ArrayList<>();
        prescriptionItems.add(new BenefitDTO.BenefitItem("Generic Drugs (Tier 1)", "75% after deductible", "$10"));
        prescriptionItems.add(new BenefitDTO.BenefitItem("Brand Name (Tier 2)", "75% after deductible", "$35"));
        prescriptionItems.add(new BenefitDTO.BenefitItem("Specialty Drugs (Tier 3)", "75% after deductible", "$75"));
        prescriptionCategory.setItems(prescriptionItems);
        benefits.add(prescriptionCategory);

        // Mental Health Category
        BenefitDTO mentalHealthCategory = new BenefitDTO();
        mentalHealthCategory.setCategory("Mental Health");
        List<BenefitDTO.BenefitItem> mentalHealthItems = new ArrayList<>();
        mentalHealthItems.add(new BenefitDTO.BenefitItem("Therapy Sessions", "80% after deductible", "$50"));
        mentalHealthItems.add(new BenefitDTO.BenefitItem("Psychiatrist Visits", "80% after deductible", "$50"));
        mentalHealthItems.add(new BenefitDTO.BenefitItem("Inpatient Mental Health", "80% after deductible", "Varies"));
        mentalHealthCategory.setItems(mentalHealthItems);
        benefits.add(mentalHealthCategory);

        return benefits;
    }
}