-- Diagnostic queries to understand the patient_id issue

-- 1. Check what Users exist
SELECT 'Users Table' as table_name, id as user_id, name, email FROM Users WHERE ROWNUM <= 5;

-- 2. Check what Patients exist and their relationship to Users
SELECT 'Patients Table' as table_name, id as patient_id, user_id, dob, gender FROM Patients WHERE ROWNUM <= 5;

-- 3. Check the relationship between Users and Patients
SELECT 
    u.id as user_id,
    u.name as user_name,
    p.id as patient_id,
    CASE 
        WHEN p.id IS NULL THEN 'NO PATIENT RECORD'
        ELSE 'HAS PATIENT RECORD'
    END as status
FROM Users u
LEFT JOIN Patients p ON u.id = p.user_id
WHERE ROWNUM <= 10;

-- 4. Check if there are any existing Patient_Insurance records
SELECT COUNT(*) as existing_patient_insurance_count FROM Patient_Insurance;

-- 5. Find Users who have Patient records (these are valid for insurance)
SELECT 
    u.id as user_id,
    u.name as user_name,
    p.id as patient_id
FROM Users u
INNER JOIN Patients p ON u.id = p.user_id
WHERE ROWNUM <= 5;

-- 6. Check what patient_id your frontend is trying to use
-- (This will show you if the user_id being sent exists as a patient)
-- Replace 'YOUR_USER_ID' with the actual ID your frontend is sending
-- SELECT 
--     u.id as user_id,
--     u.name,
--     p.id as patient_id,
--     CASE 
--         WHEN p.id IS NULL THEN 'ERROR: No patient record for this user'
--         ELSE 'OK: Patient record exists'
--     END as validation_status
-- FROM Users u
-- LEFT JOIN Patients p ON u.id = p.user_id
-- WHERE u.id = 'YOUR_USER_ID';
