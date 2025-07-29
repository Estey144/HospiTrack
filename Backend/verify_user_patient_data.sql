-- SQL script to verify and create test data for user-to-patient relationship
-- Since schema cannot be changed, we need to ensure proper data exists

-- Step 1: Check current data structure
SELECT 'Current Users' as data_type, COUNT(*) as count FROM Users;
SELECT 'Current Patients' as data_type, COUNT(*) as count FROM Patients;
SELECT 'Current Insurance Providers' as data_type, COUNT(*) as count FROM Insurance_Providers;

-- Step 2: Show user-patient relationship
SELECT 
    u.id as user_id,
    u.name as user_name,
    u.email,
    p.id as patient_id,
    CASE 
        WHEN p.id IS NOT NULL THEN 'HAS PATIENT RECORD'
        ELSE 'MISSING PATIENT RECORD'
    END as patient_status
FROM Users u
LEFT JOIN Patients p ON u.id = p.user_id
ORDER BY u.created_at DESC;

-- Step 3: If you need to create a patient record for an existing user, use this template:
-- IMPORTANT: Replace 'YOUR_USER_ID' with actual user ID from above query

/*
-- Example: Create patient record for user who doesn't have one
INSERT INTO Patients (
    id, 
    user_id, 
    dob, 
    gender, 
    blood_type, 
    address, 
    emergency_contact
) VALUES (
    'patient-' || DBMS_RANDOM.STRING('X', 8),  -- Generate unique patient ID
    'YOUR_USER_ID',                            -- Replace with actual user ID
    TO_DATE('1990-01-01', 'YYYY-MM-DD'),      -- Date of birth
    'Male',                                    -- Gender
    'O+',                                      -- Blood type
    '123 Test Address',                        -- Address
    '555-0123'                                 -- Emergency contact
);

-- Create insurance provider if needed
INSERT INTO Insurance_Providers (
    id,
    name,
    contact_info
) VALUES (
    'provider-' || DBMS_RANDOM.STRING('X', 8),
    'Test Health Insurance',
    'contact@testhealth.com, 555-0199'
);

COMMIT;
*/

-- Step 4: Verify the conversion query that your service uses
-- This shows which users can successfully create insurance records
SELECT 
    u.id as user_id,
    u.name as user_name,
    p.id as patient_id,
    CASE 
        WHEN p.id IS NOT NULL THEN 'CAN CREATE INSURANCE'
        ELSE 'CANNOT CREATE INSURANCE - NEED PATIENT RECORD'
    END as insurance_eligibility
FROM Users u
LEFT JOIN Patients p ON u.id = p.user_id
WHERE u.role = 'Patient' OR u.role IS NULL
ORDER BY u.created_at DESC;
