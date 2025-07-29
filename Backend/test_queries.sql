-- SQL Queries to Test Insurance Data Fetching
-- Run these queries in your Oracle database to check if data exists

-- 1. Check if Users table has data (for patient IDs)
SELECT COUNT(*) as user_count FROM Users;
SELECT user_id, username, email FROM Users WHERE ROWNUM <= 5;

-- 2. Check if Patient_Insurance table has data
SELECT COUNT(*) as patient_insurance_count FROM Patient_Insurance;
SELECT * FROM Patient_Insurance WHERE ROWNUM <= 5;

-- 3. Check if Insurance_Providers table has data
SELECT COUNT(*) as provider_count FROM Insurance_Providers;
SELECT * FROM Insurance_Providers WHERE ROWNUM <= 5;

-- 4. Check if Claims table has data
SELECT COUNT(*) as claims_count FROM Claims;
SELECT * FROM Claims WHERE ROWNUM <= 5;

-- 5. Test the exact query that getInsurancePlans() method uses
-- Replace '1' with an actual patient_id from your Users table
SELECT 
    pi.id,
    pi.patient_id as patientId,
    pi.provider_id as providerId,
    pi.policy_number as policyNumber,
    pi.start_date as startDate,
    pi.end_date as endDate,
    pi.premium_amount as premiumAmount,
    pi.deductible,
    pi.coverage_type as coverageType,
    pi.status,
    ip.provider_name as providerName,
    ip.contact_info as contactInfo
FROM Patient_Insurance pi
JOIN Insurance_Providers ip ON pi.provider_id = ip.provider_id
WHERE pi.patient_id = '1';

-- 6. Test the exact query that getClaimsForPatient() method uses
-- Replace '1' with an actual patient_id from your Users table
SELECT 
    c.claim_id as claimId,
    c.patient_id as patientId,
    c.provider_id as providerId,
    c.claim_amount as claimAmount,
    c.claim_status as claimStatus,
    c.claim_date as claimDate,
    c.description,
    c.approval_date as approvalDate,
    ip.provider_name as providerName
FROM Claims c
LEFT JOIN Insurance_Providers ip ON c.provider_id = ip.provider_id
WHERE c.patient_id = '1';

-- 7. Test the exact query that getAllInsuranceProviders() method uses
SELECT 
    provider_id as providerId,
    provider_name as providerName,
    contact_info as contactInfo,
    coverage_types as coverageTypes,
    network_hospitals as networkHospitals
FROM Insurance_Providers;

-- 8. Test the exact query that getBenefitsForPatient() method uses
-- Replace '1' with an actual patient_id from your Users table
SELECT 
    'Medical Service' as benefitType,
    pi.coverage_type as coverage,
    pi.deductible as amount,
    pi.status as status
FROM Patient_Insurance pi
WHERE pi.patient_id = '1' AND pi.status = 'Active'
UNION ALL
SELECT 
    'Prescription' as benefitType,
    'Covered' as coverage,
    0 as amount,
    'Active' as status
FROM Patient_Insurance pi
WHERE pi.patient_id = '1' AND pi.status = 'Active'
UNION ALL
SELECT 
    'Emergency Care' as benefitType,
    'Full Coverage' as coverage,
    pi.deductible as amount,
    pi.status as status
FROM Patient_Insurance pi
WHERE pi.patient_id = '1' AND pi.status = 'Active';

-- 9. Check if there are any foreign key constraint issues
-- Find patients who have insurance records
SELECT DISTINCT pi.patient_id 
FROM Patient_Insurance pi 
WHERE EXISTS (SELECT 1 FROM Users u WHERE u.user_id = pi.patient_id);

-- 10. Check for data type issues (patient_id should be consistent)
SELECT 
    'Users' as table_name,
    user_id,
    TYPEOF(user_id) as data_type
FROM Users 
WHERE ROWNUM <= 3
UNION ALL
SELECT 
    'Patient_Insurance' as table_name,
    patient_id,
    TYPEOF(patient_id) as data_type
FROM Patient_Insurance 
WHERE ROWNUM <= 3;

-- 11. Quick test with actual data to see if any patient has insurance
SELECT 
    u.user_id,
    u.username,
    COUNT(pi.id) as insurance_count
FROM Users u
LEFT JOIN Patient_Insurance pi ON u.user_id = pi.patient_id
GROUP BY u.user_id, u.username
HAVING COUNT(pi.id) > 0;
