-- Fix non-JSON coverage_details in Patient_Insurance table
-- Convert plain text to proper JSON format

-- First, let's see what we have
SELECT id, patient_id, provider_id, policy_number, coverage_details 
FROM Patient_Insurance 
WHERE coverage_details NOT LIKE '{%';

-- Update the problematic record to have proper JSON format
UPDATE Patient_Insurance 
SET coverage_details = '{"description": "' || coverage_details || '", "planType": "Standard"}'
WHERE coverage_details NOT LIKE '{%' AND coverage_details IS NOT NULL;

-- Verify the changes
SELECT id, patient_id, provider_id, policy_number, coverage_details 
FROM Patient_Insurance 
WHERE id = 'pi013';
