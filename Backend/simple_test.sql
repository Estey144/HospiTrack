-- Simple Database Connection Test
-- Run these one by one to troubleshoot step by step

-- Step 1: Check if basic tables exist
SELECT table_name FROM user_tables WHERE table_name IN ('USERS', 'PATIENT_INSURANCE', 'INSURANCE_PROVIDERS', 'CLAIMS');

-- Step 2: Count records in each table
SELECT 'Users' as table_name, COUNT(*) as record_count FROM Users
UNION ALL
SELECT 'Patient_Insurance', COUNT(*) FROM Patient_Insurance
UNION ALL  
SELECT 'Insurance_Providers', COUNT(*) FROM Insurance_Providers
UNION ALL
SELECT 'Claims', COUNT(*) FROM Claims;

-- Step 3: Get a sample user ID to test with
SELECT user_id FROM Users WHERE ROWNUM = 1;

-- Step 4: Test with that user ID (replace '1' with actual user_id from step 3)
SELECT COUNT(*) as patient_insurance_records 
FROM Patient_Insurance 
WHERE patient_id = '1';

-- Step 5: Test if Spring Boot can connect (check application.properties values)
-- Your application.properties should have:
-- spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE (or your Oracle connection)
-- spring.datasource.username=your_username
-- spring.datasource.password=your_password
