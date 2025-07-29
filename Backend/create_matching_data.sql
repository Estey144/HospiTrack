-- ALTERNATIVE: Create test data that works with current schema
-- Use this if you want to keep the current foreign key structure

-- First, check what users exist
SELECT 'Existing Users:' as info;
SELECT id, name, email FROM Users WHERE ROWNUM <= 5;

-- Check what patients exist
SELECT 'Existing Patients:' as info;
SELECT id, user_id FROM Patients WHERE ROWNUM <= 5;

-- Check if insurance providers exist
SELECT 'Existing Insurance Providers:' as info;
SELECT id, name FROM Insurance_Providers WHERE ROWNUM <= 3;

-- Example: If you have a user with id 'some-user-id', create matching patient record
-- REPLACE 'some-user-id' with actual user ID from above query

/*
-- Create patient record for existing user (replace with actual user ID)
INSERT INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact)
VALUES (
    'patient-' || SUBSTR(SYS_GUID(), 1, 8),  -- Generate unique patient ID
    'REPLACE_WITH_ACTUAL_USER_ID',            -- Use actual user ID from your Users table
    TO_DATE('1990-01-01', 'YYYY-MM-DD'), 
    'Male', 
    'O+', 
    '123 Test Street', 
    '555-0123'
);

-- Create insurance provider if none exists
INSERT INTO Insurance_Providers (id, name, contact_info)
VALUES (
    'provider-' || SUBSTR(SYS_GUID(), 1, 8),
    'Test Health Insurance', 
    'contact@testhealth.com'
);

-- Now your frontend can use the patient.id (not user.id) for insurance operations
-- Get the patient ID for a user:
SELECT p.id as patient_id, u.id as user_id, u.name 
FROM Users u 
JOIN Patients p ON u.id = p.user_id 
WHERE u.id = 'REPLACE_WITH_ACTUAL_USER_ID';

COMMIT;
*/
