-- SOLUTION: Fix the foreign key constraint to point to Users instead of Patients
-- This is the cleanest solution since your frontend works with user.id

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE Patient_Insurance 
DROP CONSTRAINT fk_patientinsurance_patient;

-- Step 2: Add the new foreign key constraint pointing to Users table
ALTER TABLE Patient_Insurance 
ADD CONSTRAINT fk_patientinsurance_user 
FOREIGN KEY (patient_id) REFERENCES Users(id);

-- Step 3: Test the constraint (optional)
-- This should now work with user_id values from your frontend
-- INSERT INTO Patient_Insurance (id, patient_id, provider_id, policy_number, coverage_details) 
-- VALUES ('test-ins-1', 'USER_ID_FROM_FRONTEND', 'PROVIDER_ID', 'POL123', 'Test coverage');

-- Step 4: Verify the change
SELECT 
    constraint_name, 
    table_name, 
    column_name, 
    r_constraint_name
FROM user_cons_columns 
WHERE constraint_name = 'FK_PATIENTINSURANCE_USER';

COMMIT;
