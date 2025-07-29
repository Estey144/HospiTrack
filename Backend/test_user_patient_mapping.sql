-- Test data to verify user_id to patient_id conversion works
-- Run these queries to create test data if your tables are empty

-- First, let's see what data exists
SELECT 'Current Users:' as info;
SELECT id, name, email, role FROM Users WHERE ROWNUM <= 5;

SELECT 'Current Patients:' as info;
SELECT id, user_id, dob, gender FROM Patients WHERE ROWNUM <= 5;

SELECT 'Current Insurance Providers:' as info;
SELECT id, name FROM Insurance_Providers WHERE ROWNUM <= 3;

-- If you need test data, uncomment and run these:
/*
-- Insert a test user if none exists
INSERT INTO Users (id, name, email, password, phone, created_at, role) 
VALUES ('test-user-1', 'John Doe', 'john.doe@test.com', 'password123', '1234567890', SYSDATE, 'Patient');

-- Insert a corresponding patient record
INSERT INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact)
VALUES ('test-patient-1', 'test-user-1', TO_DATE('1990-01-01', 'YYYY-MM-DD'), 'Male', 'O+', '123 Test St', '0987654321');

-- Insert an insurance provider if none exists
INSERT INTO Insurance_Providers (id, name, contact_info)
VALUES ('test-provider-1', 'Test Insurance Co.', 'contact@testinsurance.com');

-- Commit the changes
COMMIT;
*/

-- Test the conversion query that your service uses
SELECT 
    u.id as user_id,
    u.name as user_name,
    p.id as patient_id,
    CASE 
        WHEN p.id IS NOT NULL THEN 'Valid - Can create insurance'
        ELSE 'Invalid - Need patient record'
    END as status
FROM Users u
LEFT JOIN Patients p ON u.id = p.user_id
ORDER BY u.created_at DESC;
