-- Final setup script to fix insurance page navigation
-- This will help you create the necessary patient records

-- Step 1: Check what users exist and which ones need patient records
SELECT 
    'Users without Patient Records:' as info,
    u.id as user_id,
    u.name as user_name,
    u.email,
    'NEEDS PATIENT RECORD' as action_needed
FROM Users u
LEFT JOIN Patients p ON u.id = p.user_id
WHERE p.id IS NULL
AND ROWNUM <= 10;

-- Step 2: Check existing patient records
SELECT 
    'Users with Patient Records:' as info,
    u.id as user_id,
    u.name as user_name,
    p.id as patient_id,
    'CAN USE INSURANCE' as status
FROM Users u
INNER JOIN Patients p ON u.id = p.user_id
WHERE ROWNUM <= 10;

-- Step 3: Create patient records for users who don't have them
-- UNCOMMENT and MODIFY these statements to create patient records

/*
-- Example: Create patient record for a specific user
-- Replace 'USER_ID_HERE' with actual user ID from step 1 above

INSERT INTO Patients (
    id,
    user_id,
    dob,
    gender,
    blood_type,
    address,
    emergency_contact
) VALUES (
    'patient-' || SUBSTR(DBMS_RANDOM.STRING('X', 12), 1, 12),
    'USER_ID_HERE',  -- Replace with actual user ID
    TO_DATE('1990-01-01', 'YYYY-MM-DD'),
    'Male',
    'O+',
    '123 Main Street, City, State',
    '555-0123'
);

-- Create insurance provider if none exists
INSERT INTO Insurance_Providers (
    id,
    name,
    contact_info
) VALUES (
    'provider-' || SUBSTR(DBMS_RANDOM.STRING('X', 8), 1, 8),
    'Default Health Insurance',
    'Phone: 555-0199, Email: info@defaulthealth.com'
);

COMMIT;
*/

-- Step 4: After creating patient records, verify the fix
SELECT 
    'Final Verification:' as info,
    COUNT(CASE WHEN p.id IS NOT NULL THEN 1 END) as users_with_patients,
    COUNT(CASE WHEN p.id IS NULL THEN 1 END) as users_without_patients,
    COUNT(*) as total_users
FROM Users u
LEFT JOIN Patients p ON u.id = p.user_id;
