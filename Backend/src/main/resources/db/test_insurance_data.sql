-- Insert test insurance providers
INSERT INTO Insurance_Providers (id, name, contact_info) VALUES 
('provider-1', 'Blue Cross Blue Shield', '{"phone": "1-800-123-4567", "website": "www.bcbs.com"}'),
('provider-2', 'Aetna Health', '{"phone": "1-800-987-6543", "website": "www.aetna.com"}'),
('provider-3', 'UnitedHealthcare', '{"phone": "1-800-555-0123", "website": "www.uhc.com"}');

-- Insert test patient insurance (assuming you have a patient with ID 'test-patient-1')
INSERT INTO Patient_Insurance (id, patient_id, provider_id, policy_number, coverage_details) VALUES 
('insurance-1', 'test-patient-1', 'provider-1', 'BCBS12345678', '{"planName": "Premium Health Plan", "groupNumber": "GRP001", "memberID": "MEM123456", "effectiveDate": "2024-01-01", "expirationDate": "2024-12-31", "status": "active", "isPrimary": true, "employer": "Tech Corp", "deductible": {"individual": 1000, "met": 250}, "outOfPocketMax": {"individual": 5000, "met": 750}, "coverage": {"medical": 80, "dental": 70, "vision": 60}}');

-- Insert test appointments (needed for claims)
INSERT INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES 
('appointment-1', 'test-patient-1', 'doctor-1', SYSDATE - 30, '10:00 AM', 'Consultation', 'completed'),
('appointment-2', 'test-patient-1', 'doctor-1', SYSDATE - 15, '2:00 PM', 'Follow-up', 'completed');

-- Insert test claims
INSERT INTO Claims (id, appointment_id, insurance_id, claim_status, claim_amount, submitted_on) VALUES 
('claim-1', 'appointment-1', 'provider-1', 'processed', 250.00, SYSDATE - 25),
('claim-2', 'appointment-2', 'provider-1', 'pending', 150.00, SYSDATE - 10);

-- Check if data was inserted
SELECT 'Insurance Providers' as table_name, COUNT(*) as count FROM Insurance_Providers
UNION ALL
SELECT 'Patient Insurance' as table_name, COUNT(*) as count FROM Patient_Insurance
UNION ALL
SELECT 'Claims' as table_name, COUNT(*) as count FROM Claims;
