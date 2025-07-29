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

    public List<PatientInsuranceDTO> getInsurancePlans(String patientId) {
        System.out.println("Getting insurance plans for patient: " + patientId);
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
        
        System.out.println("Found " + plans.size() + " insurance plans");
        return plans;
    }

    public List<ClaimDTO> getClaimsForPatient(String patientId) {
        System.out.println("Getting claims for patient: " + patientId);
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
        
        System.out.println("Found " + claims.size() + " claims");
        return claims;
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
        String newId = UUID.randomUUID().toString();
        String sql = "INSERT INTO Patient_Insurance (id, patient_id, provider_id, policy_number, coverage_details) " +
                "VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                newId,
                dto.getPatientId(),
                dto.getProviderId(),
                dto.getPolicyNumber(),
                dto.getCoverageDetails());

        // Return the created plan with ID
        dto.setId(newId);
        return dto;
    }

    public List<BenefitDTO> getBenefitsForPatient(String patientId) {
        // For now, return static benefits data
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