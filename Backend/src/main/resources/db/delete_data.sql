-- Level 1: Deepest children (no FK dependencies)
DELETE FROM pres_med;
DELETE FROM bill_items;
DELETE FROM doctor_specializations;
DELETE FROM branch_contacts;
DELETE FROM cabin;

-- Level 2: Depends on others
DELETE FROM prescriptions;
DELETE FROM room_assignments;
DELETE FROM lab_tests;
DELETE FROM ambulance_requests;
DELETE FROM device_logs;
DELETE FROM videosessions;
DELETE FROM chatlogs;
DELETE FROM symptom_checker;
DELETE FROM feedback;
DELETE FROM patient_insurance;
DELETE FROM claims;

-- Level 3: Middle layer
DELETE FROM appointments;
DELETE FROM bills;

-- Level 4: References USERS, DOCTORS, PATIENTS
DELETE FROM doctors;
DELETE FROM patients;
DELETE FROM staff;
DELETE FROM ambulances;

-- Level 5: Less dependent
DELETE FROM hospital_branches;
DELETE FROM departments;
DELETE FROM rooms;
DELETE FROM insurance_providers;
DELETE FROM medications;
DELETE FROM specializations;

-- Level 6: Audit logs (user activity)
DELETE FROM audit_log;

-- Level 7: Root table
DELETE FROM users;
