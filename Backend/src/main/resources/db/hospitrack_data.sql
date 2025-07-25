-- Hospital Management System Sample Data
-- Insert data in order to maintain referential integrity

-- 1. Users Table (Foundation table)
INSERT INTO Users VALUES ('u001', 'dr. mohammad abdul karim', 'abdul.karim@hospital.com', 'password123', '+1234567890', DATE '2023-01-15', 'doctor');
INSERT INTO Users VALUES ('u002', 'dr. fatema khatun', 'fatema.khatun@hospital.com', 'password123', '+1234567891', DATE '2023-01-20', 'doctor');
INSERT INTO Users VALUES ('u003', 'dr. rahim uddin ahmed', 'rahim.ahmed@hospital.com', 'password123', '+1234567892', DATE '2023-02-01', 'doctor');
INSERT INTO Users VALUES ('u004', 'dr. mahmuda sultana', 'mahmuda.sultana@hospital.com', 'password123', '+1234567893', DATE '2023-02-15', 'doctor');
INSERT INTO Users VALUES ('u005', 'dr. nazmul haque', 'nazmul.haque@hospital.com', 'password123', '+1234567894', DATE '2023-03-01', 'doctor');
INSERT INTO Users VALUES ('u006', 'dr. shireen akhter', 'shireen.akther@hospital.com', 'password123', '+1234567895', DATE '2023-03-10', 'doctor');
INSERT INTO Users VALUES ('u007', 'dr. ashikur rahman', 'ashikur.rahman@hospital.com', 'password123', '+1234567896', DATE '2023-03-20', 'doctor');
INSERT INTO Users VALUES ('u008', 'dr. mariam faruqui', 'mariam.faruqi@hospital.com', 'password123', '+1234567897', DATE '2023-04-01', 'doctor');
INSERT INTO Users VALUES ('u009', 'dr. habibur rahman', 'rahman.habib@hospital.com', 'password123', '+1234567898', DATE '2023-04-15', 'doctor');
INSERT INTO Users VALUES ('u010', 'dr. laila arjumana banu', 'laila.banu@hospital.com', 'password123', '+1234567899', DATE '2023-05-01', 'doctor');

INSERT INTO Users VALUES ('u011', 'Alice Thompson', 'alice.thompson@email.com', 'password123', '+1234567900', DATE '2023-01-10', 'patient');
INSERT INTO Users VALUES ('u012', 'Bob Rodriguez', 'bob.rodriguez@email.com', 'password123', '+1234567901', DATE '2023-01-12', 'patient');
INSERT INTO Users VALUES ('u013', 'Carol Williams', 'carol.williams@email.com', 'password123', '+1234567902', DATE '2023-01-14', 'patient');
INSERT INTO Users VALUES ('u014', 'Daniel Garcia', 'daniel.garcia@email.com', 'password123', '+1234567903', DATE '2023-01-16', 'patient');
INSERT INTO Users VALUES ('u015', 'Eva Martinez', 'eva.martinez@email.com', 'password123', '+1234567904', DATE '2023-01-18', 'patient');
INSERT INTO Users VALUES ('u016', 'Frank Johnson', 'frank.johnson@email.com', 'password123', '+1234567905', DATE '2023-01-20', 'patient');
INSERT INTO Users VALUES ('u017', 'Grace Miller', 'grace.miller@email.com', 'password123', '+1234567906', DATE '2023-01-22', 'patient');
INSERT INTO Users VALUES ('u018', 'Henry Davis', 'henry.davis@email.com', 'password123', '+1234567907', DATE '2023-01-24', 'patient');
INSERT INTO Users VALUES ('u019', 'Ivy Wilson', 'ivy.wilson@email.com', 'password123', '+1234567908', DATE '2023-01-26', 'patient');
INSERT INTO Users VALUES ('u020', 'Jack Brown', 'jack.brown@email.com', 'password123', '+1234567909', DATE '2023-01-28', 'patient');

INSERT INTO Users VALUES ('s001', 'Nurse Nancy Green', 'nancy.green@hospital.com', 'password123', '+1234567910', DATE '2023-01-05', 'staff');
INSERT INTO Users VALUES ('s002', 'Alex Blue', 'alex.blue@hospital.com', 'password123', '+1234567911', DATE '2023-01-07', 'admin');
INSERT INTO Users VALUES ('s003', 'Tech Tom Red', 'tom.red@hospital.com', 'password123', '+1234567912', DATE '2023-01-09', 'staff');
INSERT INTO Users VALUES ('s004', 'Nurse Nina Yellow', 'nina.yellow@hospital.com', 'password123', '+1234567913', DATE '2023-01-11', 'staff');
INSERT INTO Users VALUES ('s005', 'Anna Purple', 'anna.purple@hospital.com', 'password123', '+1234567914', DATE '2023-01-13', 'admin');

-- 2. Hospital Branches
INSERT INTO Hospital_Branches VALUES ('b001', 'Main Hospital Branch', '123 Medical Center Drive, City A', DATE '2020-01-01');
INSERT INTO Hospital_Branches VALUES ('b002', 'North Branch', '456 North Street, City B', DATE '2021-03-15');
INSERT INTO Hospital_Branches VALUES ('b003', 'South Branch', '789 South Avenue, City C', DATE '2021-06-20');
INSERT INTO Hospital_Branches VALUES ('b004', 'East Branch', '321 East Road, City D', DATE '2022-01-10');
INSERT INTO Hospital_Branches VALUES ('b005', 'West Branch', '654 West Boulevard, City E', DATE '2022-04-25');
INSERT INTO Hospital_Branches VALUES ('b006', 'Central Branch', '987 Central Plaza, City F', DATE '2022-07-30');
INSERT INTO Hospital_Branches VALUES ('b007', 'Downtown Branch', '147 Downtown Square, City G', DATE '2022-10-15');
INSERT INTO Hospital_Branches VALUES ('b008', 'Suburban Branch', '258 Suburban Lane, City H', DATE '2023-01-20');
INSERT INTO Hospital_Branches VALUES ('b009', 'Metropolitan Branch', '369 Metro Center, City I', DATE '2023-04-05');
INSERT INTO Hospital_Branches VALUES ('b010', 'Community Branch', '741 Community Circle, City J', DATE '2023-07-12');

-- 3. Branch Contacts
INSERT INTO Branch_Contacts VALUES ('bc001', 'b001', '+1234567001', 'main');
INSERT INTO Branch_Contacts VALUES ('bc002', 'b001', '+1234567002', 'emergency');
INSERT INTO Branch_Contacts VALUES ('bc003', 'b002', '+1234567003', 'main');
INSERT INTO Branch_Contacts VALUES ('bc004', 'b002', '+1234567004', 'emergency');
INSERT INTO Branch_Contacts VALUES ('bc005', 'b003', '+1234567005', 'main');
INSERT INTO Branch_Contacts VALUES ('bc006', 'b003', '+1234567006', 'emergency');
INSERT INTO Branch_Contacts VALUES ('bc007', 'b004', '+1234567007', 'main');
INSERT INTO Branch_Contacts VALUES ('bc008', 'b005', '+1234567008', 'main');
INSERT INTO Branch_Contacts VALUES ('bc009', 'b006', '+1234567009', 'main');
INSERT INTO Branch_Contacts VALUES ('bc010', 'b007', '+1234567010', 'main');

-- 4. Departments
INSERT INTO Departments VALUES ('d001', 'Cardiology', 'Heart and cardiovascular system treatment');
INSERT INTO Departments VALUES ('d002', 'Neurology', 'Brain and nervous system treatment');
INSERT INTO Departments VALUES ('d003', 'Orthopedics', 'Bone and joint treatment');
INSERT INTO Departments VALUES ('d004', 'Pediatrics', 'Children healthcare');
INSERT INTO Departments VALUES ('d005', 'Dermatology', 'Skin and related conditions');
INSERT INTO Departments VALUES ('d006', 'Oncology', 'Cancer treatment and care');
INSERT INTO Departments VALUES ('d007', 'Emergency Medicine', 'Emergency and urgent care');
INSERT INTO Departments VALUES ('d008', 'Internal Medicine', 'General internal medicine');
INSERT INTO Departments VALUES ('d009', 'Surgery', 'Surgical procedures');
INSERT INTO Departments VALUES ('d010', 'Radiology', 'Medical imaging and diagnostics');

-- 5. Staff
INSERT INTO Staff VALUES ('st001', 's001', 'd004', 'Senior Nurse', 'b001');
INSERT INTO Staff VALUES ('st002', 's002', 'd001', 'Administrative Assistant', 'b001');
INSERT INTO Staff VALUES ('st003', 's003', 'd010', 'Radiology Technician', 'b002');
INSERT INTO Staff VALUES ('st004', 's004', 'd007', 'Emergency Nurse', 'b003');
INSERT INTO Staff VALUES ('st005', 's005', 'd008', 'Administrative Coordinator', 'b004');
INSERT INTO Staff VALUES ('st006', 's001', 'd002', 'Neurology Nurse', 'b005');
INSERT INTO Staff VALUES ('st007', 's002', 'd003', 'Orthopedic Assistant', 'b006');
INSERT INTO Staff VALUES ('st008', 's003', 'd005', 'Dermatology Technician', 'b007');
INSERT INTO Staff VALUES ('st009', 's004', 'd006', 'Oncology Nurse', 'b008');
INSERT INTO Staff VALUES ('st010', 's005', 'd009', 'Surgery Coordinator', 'b009');

-- 6. Doctors
INSERT INTO Doctors VALUES ('doc001', 'u001', 'b001', 'MD12345', 15, '9:00 AM - 5:00 PM', 'd001', 'https://labaid.com.bd/files/images/1700976017.jpg');
INSERT INTO Doctors VALUES ('doc002', 'u002', 'b001', 'MD12346', 12, '8:00 AM - 4:00 PM', 'd002', 'https://labaid.com.bd/files/images/1613040676.jpg');
INSERT INTO Doctors VALUES ('doc003', 'u003', 'b002', 'MD12347', 10, '10:00 AM - 6:00 PM', 'd003', 'https://labaid.com.bd/files/images/1700978846.jpg');
INSERT INTO Doctors VALUES ('doc004', 'u004', 'b002', 'MD12348', 8, '9:00 AM - 5:00 PM', 'd004', 'https://labaid.com.bd/files/images/1613040829.jpg');
INSERT INTO Doctors VALUES ('doc005', 'u005', 'b003', 'MD12349', 20, '7:00 AM - 3:00 PM', 'd005', 'https://labaid.com.bd/files/images/1700981398.jpg');
INSERT INTO Doctors VALUES ('doc006', 'u006', 'b003', 'MD12350', 14, '11:00 AM - 7:00 PM', 'd006', 'https://labaid.com.bd/files/images/1610864098.jpg');
INSERT INTO Doctors VALUES ('doc007', 'u007', 'b004', 'MD12351', 16, '8:00 AM - 4:00 PM', 'd007', 'https://labaid.com.bd/files/images/1700978055.jpg');
INSERT INTO Doctors VALUES ('doc008', 'u008', 'b005', 'MD12352', 11, '9:00 AM - 5:00 PM', 'd008', 'https://labaid.com.bd/files/images/1700980489.jpg');
INSERT INTO Doctors VALUES ('doc009', 'u009', 'b006', 'MD12353', 13, '10:00 AM - 6:00 PM', 'd009', 'https://labaid.com.bd/files/images/1700981489.jpg');
INSERT INTO Doctors VALUES ('doc010', 'u010', 'b007', 'MD12354', 9, '8:00 AM - 4:00 PM', 'd010', 'https://labaid.com.bd/files/images/1700980412.jpg');

-- 7. Patients
INSERT INTO Patients VALUES ('p001', 'u011', DATE '1990-05-15', 'Female', 'A+', '123 Oak Street, City A', '+1234567920');
INSERT INTO Patients VALUES ('p002', 'u012', DATE '1985-08-22', 'Male', 'B+', '456 Pine Avenue, City B', '+1234567921');
INSERT INTO Patients VALUES ('p003', 'u013', DATE '1992-12-03', 'Female', 'O-', '789 Maple Drive, City C', '+1234567922');
INSERT INTO Patients VALUES ('p004', 'u014', DATE '1988-03-17', 'Male', 'AB+', '321 Elm Street, City D', '+1234567923');
INSERT INTO Patients VALUES ('p005', 'u015', DATE '1995-09-08', 'Female', 'A-', '654 Cedar Lane, City E', '+1234567924');
INSERT INTO Patients VALUES ('p006', 'u016', DATE '1983-06-25', 'Male', 'B-', '987 Birch Road, City F', '+1234567925');
INSERT INTO Patients VALUES ('p007', 'u017', DATE '1991-11-12', 'Female', 'O+', '147 Walnut Avenue, City G', '+1234567926');
INSERT INTO Patients VALUES ('p008', 'u018', DATE '1987-04-30', 'Male', 'AB-', '258 Cherry Street, City H', '+1234567927');
INSERT INTO Patients VALUES ('p009', 'u019', DATE '1993-07-18', 'Female', 'A+', '369 Hickory Drive, City I', '+1234567928');
INSERT INTO Patients VALUES ('p010', 'u020', DATE '1989-10-05', 'Male', 'B+', '741 Ash Lane, City J', '+1234567929');

-- 8. Rooms
INSERT INTO Rooms VALUES ('r001', '101', 'Standard', 'Available');
INSERT INTO Rooms VALUES ('r002', '102', 'Deluxe', 'Occupied');
INSERT INTO Rooms VALUES ('r003', '103', 'ICU', 'Available');
INSERT INTO Rooms VALUES ('r004', '104', 'Emergency', 'Available');
INSERT INTO Rooms VALUES ('r005', '105', 'Standard', 'Maintenance');
INSERT INTO Rooms VALUES ('r006', '201', 'Deluxe', 'Available');
INSERT INTO Rooms VALUES ('r007', '202', 'Standard', 'Occupied');
INSERT INTO Rooms VALUES ('r008', '203', 'ICU', 'Available');
INSERT INTO Rooms VALUES ('r009', '204', 'Emergency', 'Occupied');
INSERT INTO Rooms VALUES ('r010', '205', 'Standard', 'Available');

-- 9. Appointments
INSERT INTO Appointments VALUES ('a001', 'p001', 'doc001', DATE '2024-01-15', '09:00 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a002', 'p002', 'doc002', DATE '2024-01-16', '10:00 AM', 'Follow-up', 'Completed');
INSERT INTO Appointments VALUES ('a003', 'p003', 'doc003', DATE '2024-01-17', '11:00 AM', 'Surgery', 'Scheduled');
INSERT INTO Appointments VALUES ('a004', 'p004', 'doc004', DATE '2024-01-18', '02:00 PM', 'Consultation', 'Cancelled');
INSERT INTO Appointments VALUES ('a005', 'p005', 'doc005', DATE '2024-01-19', '03:00 PM', 'Screening', 'Completed');
INSERT INTO Appointments VALUES ('a006', 'p006', 'doc006', DATE '2024-01-20', '09:30 AM', 'Treatment', 'Scheduled');
INSERT INTO Appointments VALUES ('a007', 'p007', 'doc007', DATE '2024-01-21', '10:30 AM', 'Emergency', 'Completed');
INSERT INTO Appointments VALUES ('a008', 'p008', 'doc008', DATE '2024-01-22', '11:30 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a009', 'p009', 'doc009', DATE '2024-01-23', '01:00 PM', 'Surgery', 'Scheduled');
INSERT INTO Appointments VALUES ('a010', 'p010', 'doc010', DATE '2024-01-24', '02:30 PM', 'Consultation', 'Completed');

-- 10. Cabin
INSERT INTO Cabin VALUES ('c001', 'doc001', 'r001', 'a001');
INSERT INTO Cabin VALUES ('c002', 'doc002', 'r002', 'a002');
INSERT INTO Cabin VALUES ('c003', 'doc003', 'r003', 'a003');
INSERT INTO Cabin VALUES ('c004', 'doc004', 'r004', 'a004');
INSERT INTO Cabin VALUES ('c005', 'doc005', 'r006', 'a005');
INSERT INTO Cabin VALUES ('c006', 'doc006', 'r007', 'a006');
INSERT INTO Cabin VALUES ('c007', 'doc007', 'r008', 'a007');
INSERT INTO Cabin VALUES ('c008', 'doc008', 'r009', 'a008');
INSERT INTO Cabin VALUES ('c009', 'doc009', 'r010', 'a009');
INSERT INTO Cabin VALUES ('c010', 'doc010', 'r001', 'a010');

-- 11. Room Assignments
INSERT INTO Room_Assignments VALUES ('ra001', 'r002', 'p002', DATE '2024-01-16', DATE '2024-01-18', 'Active');
INSERT INTO Room_Assignments VALUES ('ra002', 'r007', 'p007', DATE '2024-01-21', DATE '2024-01-23', 'Active');
INSERT INTO Room_Assignments VALUES ('ra003', 'r009', 'p009', DATE '2024-01-23', DATE '2024-01-25', 'Active');
INSERT INTO Room_Assignments VALUES ('ra004', 'r003', 'p003', DATE '2024-01-17', DATE '2024-01-19', 'Completed');
INSERT INTO Room_Assignments VALUES ('ra005', 'r008', 'p008', DATE '2024-01-22', DATE '2024-01-24', 'Active');
INSERT INTO Room_Assignments VALUES ('ra006', 'r001', 'p001', DATE '2024-01-15', DATE '2024-01-16', 'Completed');
INSERT INTO Room_Assignments VALUES ('ra007', 'r004', 'p004', DATE '2024-01-18', NULL, 'Cancelled');
INSERT INTO Room_Assignments VALUES ('ra008', 'r006', 'p006', DATE '2024-01-20', DATE '2024-01-22', 'Active');
INSERT INTO Room_Assignments VALUES ('ra009', 'r010', 'p010', DATE '2024-01-24', DATE '2024-01-26', 'Active');
INSERT INTO Room_Assignments VALUES ('ra010', 'r005', 'p005', DATE '2024-01-19', DATE '2024-01-20', 'Completed');

-- 12. Medications
INSERT INTO Medications VALUES ('m001', 'Aspirin', '100mg', '7 days');
INSERT INTO Medications VALUES ('m002', 'Paracetamol', '500mg', '5 days');
INSERT INTO Medications VALUES ('m003', 'Amoxicillin', '250mg', '10 days');
INSERT INTO Medications VALUES ('m004', 'Ibuprofen', '200mg', '7 days');
INSERT INTO Medications VALUES ('m005', 'Metformin', '500mg', '30 days');
INSERT INTO Medications VALUES ('m006', 'Lisinopril', '10mg', '30 days');
INSERT INTO Medications VALUES ('m007', 'Atorvastatin', '20mg', '30 days');
INSERT INTO Medications VALUES ('m008', 'Omeprazole', '20mg', '14 days');
INSERT INTO Medications VALUES ('m009', 'Levothyroxine', '50mcg', '30 days');
INSERT INTO Medications VALUES ('m010', 'Amlodipine', '5mg', '30 days');

-- 13. Prescriptions
INSERT INTO Prescriptions VALUES ('pr001', 'a002', 'doc002', 'p002', 'Take medication after meals. Follow up in 1 week.', DATE '2024-01-16');
INSERT INTO Prescriptions VALUES ('pr002', 'a005', 'doc005', 'p005', 'Apply cream twice daily. Avoid sun exposure.', DATE '2024-01-19');
INSERT INTO Prescriptions VALUES ('pr003', 'a007', 'doc007', 'p007', 'Complete antibiotic course. Rest for 3 days.', DATE '2024-01-21');
INSERT INTO Prescriptions VALUES ('pr004', 'a010', 'doc010', 'p010', 'Take before breakfast. Monitor blood pressure.', DATE '2024-01-24');
INSERT INTO Prescriptions VALUES ('pr005', 'a001', 'doc001', 'p001', 'Take with water. No alcohol consumption.', DATE '2024-01-15');
INSERT INTO Prescriptions VALUES ('pr006', 'a003', 'doc003', 'p003', 'Post-surgery medication. Take as prescribed.', DATE '2024-01-17');
INSERT INTO Prescriptions VALUES ('pr007', 'a006', 'doc006', 'p006', 'Chemotherapy support medication.', DATE '2024-01-20');
INSERT INTO Prescriptions VALUES ('pr008', 'a008', 'doc008', 'p008', 'Diabetes management. Check blood sugar regularly.', DATE '2024-01-22');
INSERT INTO Prescriptions VALUES ('pr009', 'a009', 'doc009', 'p009', 'Pre-surgery preparation medication.', DATE '2024-01-23');
INSERT INTO Prescriptions VALUES ('pr010', 'a004', 'doc004', 'p004', 'Pediatric dosage. Give with food.', DATE '2024-01-18');

-- 14. Pres_Med (Prescription-Medication relationship)
INSERT INTO Pres_Med VALUES ('pm001', 'pr001', 'm002');
INSERT INTO Pres_Med VALUES ('pm002', 'pr001', 'm003');
INSERT INTO Pres_Med VALUES ('pm003', 'pr002', 'm004');
INSERT INTO Pres_Med VALUES ('pm004', 'pr003', 'm003');
INSERT INTO Pres_Med VALUES ('pm005', 'pr003', 'm001');
INSERT INTO Pres_Med VALUES ('pm006', 'pr004', 'm005');
INSERT INTO Pres_Med VALUES ('pm007', 'pr004', 'm006');
INSERT INTO Pres_Med VALUES ('pm008', 'pr005', 'm001');
INSERT INTO Pres_Med VALUES ('pm009', 'pr006', 'm002');
INSERT INTO Pres_Med VALUES ('pm010', 'pr007', 'm008');

-- 15. Lab Tests
INSERT INTO Lab_Tests VALUES ('lt001', 'p001', 'Blood Test', DATE '2024-01-15', 'Normal', 'doc001', 'https://example.com/lab1.pdf');
INSERT INTO Lab_Tests VALUES ('lt002', 'p002', 'MRI Scan', DATE '2024-01-16', 'Abnormal', 'doc002', 'https://example.com/lab2.pdf');
INSERT INTO Lab_Tests VALUES ('lt003', 'p003', 'X-Ray', DATE '2024-01-17', 'Fracture detected', 'doc003', 'https://example.com/lab3.pdf');
INSERT INTO Lab_Tests VALUES ('lt004', 'p004', 'Urine Test', DATE '2024-01-18', 'Normal', 'doc004', 'https://example.com/lab4.pdf');
INSERT INTO Lab_Tests VALUES ('lt005', 'p005', 'Skin Biopsy', DATE '2024-01-19', 'Benign', 'doc005', 'https://example.com/lab5.pdf');
INSERT INTO Lab_Tests VALUES ('lt006', 'p006', 'CT Scan', DATE '2024-01-20', 'Tumor detected', 'doc006', 'https://example.com/lab6.pdf');
INSERT INTO Lab_Tests VALUES ('lt007', 'p007', 'ECG', DATE '2024-01-21', 'Irregular rhythm', 'doc007', 'https://example.com/lab7.pdf');
INSERT INTO Lab_Tests VALUES ('lt008', 'p008', 'Blood Sugar', DATE '2024-01-22', 'Elevated', 'doc008', 'https://example.com/lab8.pdf');
INSERT INTO Lab_Tests VALUES ('lt009', 'p009', 'Ultrasound', DATE '2024-01-23', 'Normal', 'doc009', 'https://example.com/lab9.pdf');
INSERT INTO Lab_Tests VALUES ('lt010', 'p010', 'Chest X-Ray', DATE '2024-01-24', 'Clear', 'doc010', 'https://example.com/lab10.pdf');

-- 16. Bills
INSERT INTO Bills VALUES ('b001', 'p001', 'a001', 150.00, 'Paid', DATE '2024-01-15');
INSERT INTO Bills VALUES ('b002', 'p002', 'a002', 250.50, 'Paid', DATE '2024-01-16');
INSERT INTO Bills VALUES ('b003', 'p003', 'a003', 1500.00, 'Pending', DATE '2024-01-17');
INSERT INTO Bills VALUES ('b004', 'p004', 'a004', 75.00, 'Cancelled', DATE '2024-01-18');
INSERT INTO Bills VALUES ('b005', 'p005', 'a005', 300.25, 'Paid', DATE '2024-01-19');
INSERT INTO Bills VALUES ('b006', 'p006', 'a006', 2000.00, 'Pending', DATE '2024-01-20');
INSERT INTO Bills VALUES ('b007', 'p007', 'a007', 500.75, 'Paid', DATE '2024-01-21');
INSERT INTO Bills VALUES ('b008', 'p008', 'a008', 180.00, 'Pending', DATE '2024-01-22');
INSERT INTO Bills VALUES ('b009', 'p009', 'a009', 3000.00, 'Pending', DATE '2024-01-23');
INSERT INTO Bills VALUES ('b010', 'p010', 'a010', 125.50, 'Paid', DATE '2024-01-24');

-- 17. Bill Items
INSERT INTO Bill_Items VALUES ('bi001', 'b001', 'Consultation Fee', 100.00);
INSERT INTO Bill_Items VALUES ('bi002', 'b001', 'Lab Test', 50.00);
INSERT INTO Bill_Items VALUES ('bi003', 'b002', 'MRI Scan', 200.00);
INSERT INTO Bill_Items VALUES ('bi004', 'b002', 'Consultation Fee', 50.50);
INSERT INTO Bill_Items VALUES ('bi005', 'b003', 'Surgery Fee', 1200.00);
INSERT INTO Bill_Items VALUES ('bi006', 'b003', 'Room Charges', 300.00);
INSERT INTO Bill_Items VALUES ('bi007', 'b005', 'Skin Treatment', 250.25);
INSERT INTO Bill_Items VALUES ('bi008', 'b005', 'Medication', 50.00);
INSERT INTO Bill_Items VALUES ('bi009', 'b006', 'Chemotherapy', 1800.00);
INSERT INTO Bill_Items VALUES ('bi010', 'b006', 'Room Charges', 200.00);

-- 18. Specializations
INSERT INTO Specializations VALUES ('sp001', 'Interventional Cardiology', 'Heart procedures and interventions');
INSERT INTO Specializations VALUES ('sp002', 'Pediatric Neurology', 'Children brain and nervous system');
INSERT INTO Specializations VALUES ('sp003', 'Sports Medicine', 'Athletic injuries and performance');
INSERT INTO Specializations VALUES ('sp004', 'Neonatology', 'Newborn intensive care');
INSERT INTO Specializations VALUES ('sp005', 'Cosmetic Dermatology', 'Aesthetic skin treatments');
INSERT INTO Specializations VALUES ('sp006', 'Radiation Oncology', 'Cancer radiation therapy');
INSERT INTO Specializations VALUES ('sp007', 'Trauma Surgery', 'Emergency surgical procedures');
INSERT INTO Specializations VALUES ('sp008', 'Gastroenterology', 'Digestive system disorders');
INSERT INTO Specializations VALUES ('sp009', 'Plastic Surgery', 'Reconstructive and cosmetic surgery');
INSERT INTO Specializations VALUES ('sp010', 'Interventional Radiology', 'Minimally invasive procedures');

-- 19. Doctor Specializations
INSERT INTO Doctor_Specializations VALUES ('ds001', 'doc001', 'sp001');
INSERT INTO Doctor_Specializations VALUES ('ds002', 'doc002', 'sp002');
INSERT INTO Doctor_Specializations VALUES ('ds003', 'doc003', 'sp003');
INSERT INTO Doctor_Specializations VALUES ('ds004', 'doc004', 'sp004');
INSERT INTO Doctor_Specializations VALUES ('ds005', 'doc005', 'sp005');
INSERT INTO Doctor_Specializations VALUES ('ds006', 'doc006', 'sp006');
INSERT INTO Doctor_Specializations VALUES ('ds007', 'doc007', 'sp007');
INSERT INTO Doctor_Specializations VALUES ('ds008', 'doc008', 'sp008');
INSERT INTO Doctor_Specializations VALUES ('ds009', 'doc009', 'sp009');
INSERT INTO Doctor_Specializations VALUES ('ds010', 'doc010', 'sp010');

-- 20. Audit Log
INSERT INTO Audit_Log VALUES ('al001', 'u001', 'CREATE', 'Appointments', DATE '2024-01-15', 'New appointment created for patient p001');
INSERT INTO Audit_Log VALUES ('al002', 'u002', 'UPDATE', 'Appointments', DATE '2024-01-16', 'Appointment status changed to completed');
INSERT INTO Audit_Log VALUES ('al003', 's002', 'CREATE', 'Bills', DATE '2024-01-17', 'New bill generated for appointment a003');
INSERT INTO Audit_Log VALUES ('al004', 'u004', 'CANCEL', 'Appointments', DATE '2024-01-18', 'Appointment cancelled by doctor');
INSERT INTO Audit_Log VALUES ('al005', 'u005', 'CREATE', 'Prescriptions', DATE '2024-01-19', 'New prescription issued');
INSERT INTO Audit_Log VALUES ('al006', 's001', 'UPDATE', 'Patients', DATE '2024-01-20', 'Patient information updated');
INSERT INTO Audit_Log VALUES ('al007', 'u007', 'CREATE', 'Lab_Tests', DATE '2024-01-21', 'New lab test ordered');
INSERT INTO Audit_Log VALUES ('al008', 'u008', 'UPDATE', 'Bills', DATE '2024-01-22', 'Bill payment status updated');
INSERT INTO Audit_Log VALUES ('al009', 'u009', 'CREATE', 'Room_Assignments', DATE '2024-01-23', 'Room assigned to patient');
INSERT INTO Audit_Log VALUES ('al010', 'u010', 'UPDATE', 'Appointments', DATE '2024-01-24', 'Appointment completed successfully');

-- 21. Ambulances
INSERT INTO Ambulances VALUES ('amb001', 'AMB-001', 'Available', 'Main Hospital Branch', 'b001');
INSERT INTO Ambulances VALUES ('amb002', 'AMB-002', 'In Transit', 'North Branch', 'b002');
INSERT INTO Ambulances VALUES ('amb003', 'AMB-003', 'Available', 'South Branch', 'b003');
INSERT INTO Ambulances VALUES ('amb004', 'AMB-004', 'Maintenance', 'East Branch', 'b004');
INSERT INTO Ambulances VALUES ('amb005', 'AMB-005', 'Available', 'West Branch', 'b005');
INSERT INTO Ambulances VALUES ('amb006', 'AMB-006', 'In Transit', 'Central Branch', 'b006');
INSERT INTO Ambulances VALUES ('amb007', 'AMB-007', 'Available', 'Downtown Branch', 'b007');
INSERT INTO Ambulances VALUES ('amb008', 'AMB-008', 'Available', 'Suburban Branch', 'b008');
INSERT INTO Ambulances VALUES ('amb009', 'AMB-009', 'In Transit', 'Metropolitan Branch', 'b009');
INSERT INTO Ambulances VALUES ('amb010', 'AMB-010', 'Available', 'Community Branch', 'b010');

-- 22. Ambulance Requests
INSERT INTO Ambulance_Requests VALUES ('ar001', 'p001', 'amb001', DATE '2024-01-15', '123 Oak Street', 'Main Hospital', 'Completed');
INSERT INTO Ambulance_Requests VALUES ('ar002', 'p002', 'amb002', DATE '2024-01-16', '456 Pine Avenue', 'North Branch', 'In Progress');
INSERT INTO Ambulance_Requests VALUES ('ar003', 'p003', 'amb003', DATE '2024-01-17', '789 Maple Drive', 'South Branch', 'Completed');
INSERT INTO Ambulance_Requests VALUES ('ar004', 'p004', 'amb005', DATE '2024-01-18', '321 Elm Street', 'West Branch', 'Cancelled');
INSERT INTO Ambulance_Requests VALUES ('ar005', 'p005', 'amb007', DATE '2024-01-19', '654 Cedar Lane', 'Downtown Branch', 'Completed');
INSERT INTO Ambulance_Requests VALUES ('ar006', 'p006', 'amb006', DATE '2024-01-20', '987 Birch Road', 'Central Branch', 'In Progress');
INSERT INTO Ambulance_Requests VALUES ('ar007', 'p007', 'amb008', DATE '2024-01-21', '147 Walnut Avenue', 'Suburban Branch', 'Completed');
INSERT INTO Ambulance_Requests VALUES ('ar008', 'p008', 'amb009', DATE '2024-01-22', '258 Cherry Street', 'Metropolitan Branch', 'In Progress');
INSERT INTO Ambulance_Requests VALUES ('ar009', 'p009', 'amb010', DATE '2024-01-23', '369 Hickory Drive', 'Community Branch', 'Pending');
INSERT INTO Ambulance_Requests VALUES ('ar010', 'p010', 'amb001', DATE '2024-01-24', '741 Ash Lane', 'Main Hospital', 'Completed');

-- 23. Device Logs
INSERT INTO Device_Logs VALUES ('dl001', 'p001', 'Blood Pressure Monitor', 'Systolic', '120', DATE '2024-01-15');
INSERT INTO Device_Logs VALUES ('dl002', 'p001', 'Blood Pressure Monitor', 'Diastolic', '80', DATE '2024-01-15');
INSERT INTO Device_Logs VALUES ('dl003', 'p002', 'Heart Rate Monitor', 'BPM', '72', DATE '2024-01-16');
INSERT INTO Device_Logs VALUES ('dl004', 'p003', 'Pulse Oximeter', 'Oxygen Saturation', '98', DATE '2024-01-17');
INSERT INTO Device_Logs VALUES ('dl005', 'p004', 'Thermometer', 'Body Temperature', '98.6', DATE '2024-01-18');
INSERT INTO Device_Logs VALUES ('dl006', 'p005', 'Glucometer', 'Blood Sugar', '110', DATE '2024-01-19');
INSERT INTO Device_Logs VALUES ('dl007', 'p006', 'ECG Monitor', 'Heart Rhythm', 'Normal Sinus', DATE '2024-01-20');
INSERT INTO Device_Logs VALUES ('dl008', 'p007', 'Blood Pressure Monitor', 'Systolic', '140', DATE '2024-01-21');
INSERT INTO Device_Logs VALUES ('dl009', 'p008', 'Pulse Oximeter', 'Oxygen Saturation', '95', DATE '2024-01-22');
INSERT INTO Device_Logs VALUES ('dl010', 'p009', 'Heart Rate Monitor', 'BPM', '85', DATE '2024-01-23');

-- 24. Video Sessions
INSERT INTO VideoSessions VALUES ('vs001', 'a001', 'https://meet.hospital.com/session1', 'Completed');
INSERT INTO VideoSessions VALUES ('vs002', 'a002', 'https://meet.hospital.com/session2', 'Completed');
INSERT INTO VideoSessions VALUES ('vs003', 'a005', 'https://meet.hospital.com/session3', 'Completed');
INSERT INTO VideoSessions VALUES ('vs004', 'a006', 'https://meet.hospital.com/session4', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs005', 'a008', 'https://meet.hospital.com/session5', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs006', 'a010', 'https://meet.hospital.com/session6', 'Completed');
INSERT INTO VideoSessions VALUES ('vs007', 'a003', 'https://meet.hospital.com/session7', 'Cancelled');
INSERT INTO VideoSessions VALUES ('vs008', 'a007', 'https://meet.hospital.com/session8', 'Completed');
INSERT INTO VideoSessions VALUES ('vs009', 'a009', 'https://meet.hospital.com/session9', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs010', 'a004', 'https://meet.hospital.com/session10', 'Cancelled');

-- 25. Chat Logs
INSERT INTO ChatLogs VALUES ('cl001', 'a001', 'u011', 'Hello Doctor, I have been experiencing chest pain.', DATE '2024-01-15');
INSERT INTO ChatLogs VALUES ('cl002', 'a001', 'u001', 'Can you describe the pain? When did it start?', DATE '2024-01-15');
INSERT INTO ChatLogs VALUES ('cl003', 'a002', 'u012', 'Thank you for the follow-up appointment.', DATE '2024-01-16');
INSERT INTO ChatLogs VALUES ('cl004', 'a002', 'u002', 'Your test results look good. Continue the medication.', DATE '2024-01-16');
INSERT INTO ChatLogs VALUES ('cl005', 'a005', 'u015', 'When will I get my biopsy results?', DATE '2024-01-19');
INSERT INTO ChatLogs VALUES ('cl006', 'a005', 'u005', 'Results should be available by tomorrow evening.', DATE '2024-01-19');
INSERT INTO ChatLogs VALUES ('cl007', 'a008', 'u018', 'I am feeling much better after the treatment.', DATE '2024-01-22');
INSERT INTO ChatLogs VALUES ('cl008', 'a008', 'u008', 'That''s great to hear. Let''s schedule your next check-up.', DATE '2024-01-22');
INSERT INTO ChatLogs VALUES ('cl009', 'a010', 'u020', 'What precautions should I take post-surgery?', DATE '2024-01-24');
INSERT INTO ChatLogs VALUES ('cl010', 'a010', 'u010', 'Avoid heavy lifting and follow the medication schedule.', DATE '2024-01-24');

-- 26. Symptom Checker
INSERT INTO Symptom_Checker VALUES ('sc001', 'p001', 'Chest pain, shortness of breath, dizziness', 'Possible heart condition, recommend immediate consultation', DATE '2024-01-14');
INSERT INTO Symptom_Checker VALUES ('sc002', 'p002', 'Headache, blurred vision, nausea', 'Possible neurological issue, recommend MRI scan', DATE '2024-01-15');
INSERT INTO Symptom_Checker VALUES ('sc003', 'p003', 'Joint pain, swelling, limited mobility', 'Possible arthritis or injury, recommend X-ray', DATE '2024-01-16');
INSERT INTO Symptom_Checker VALUES ('sc004', 'p004', 'Fever, cough, fatigue', 'Possible viral infection, recommend rest and fluids', DATE '2024-01-17');
INSERT INTO Symptom_Checker VALUES ('sc005', 'p005', 'Skin rash, itching, redness', 'Possible allergic reaction, recommend dermatology consultation', DATE '2024-01-18');
INSERT INTO Symptom_Checker VALUES ('sc006', 'p006', 'Unexplained weight loss, fatigue, night sweats', 'Requires immediate medical attention, possible serious condition', DATE '2024-01-19');
INSERT INTO Symptom_Checker VALUES ('sc007', 'p007', 'Severe abdominal pain, vomiting', 'Possible emergency condition, seek immediate care', DATE '2024-01-20');
INSERT INTO Symptom_Checker VALUES ('sc008', 'p008', 'Frequent urination, excessive thirst, fatigue', 'Possible diabetes, recommend blood sugar test', DATE '2024-01-21');
INSERT INTO Symptom_Checker VALUES ('sc009', 'p009', 'Persistent cough, chest pain, difficulty breathing', 'Possible respiratory condition, recommend chest X-ray', DATE '2024-01-22');
INSERT INTO Symptom_Checker VALUES ('sc010', 'p010', 'Vision problems, eye pain, sensitivity to light', 'Possible eye condition, recommend ophthalmology consultation', DATE '2024-01-23');

-- 27. Feedback
INSERT INTO Feedback VALUES ('f001', 'p001', 'doctor', 'doc001', 5, 'Excellent care and very professional', DATE '2024-01-16');
INSERT INTO Feedback VALUES ('f002', 'p002', 'doctor', 'doc002', 4, 'Good consultation, helpful advice', DATE '2024-01-17');
INSERT INTO Feedback VALUES ('f003', 'p003', 'hospital', 'b002', 3, 'Hospital facilities are average', DATE '2024-01-18');
INSERT INTO Feedback VALUES ('f004', 'p005', 'doctor', 'doc005', 5, 'Very satisfied with the treatment', DATE '2024-01-20');
INSERT INTO Feedback VALUES ('f005', 'p007', 'staff', 'st004', 4, 'Nursing staff was very caring', DATE '2024-01-22');
INSERT INTO Feedback VALUES ('f006', 'p008', 'doctor', 'doc008', 4, 'Doctor explained everything clearly', DATE '2024-01-23');
INSERT INTO Feedback VALUES ('f007', 'p010', 'hospital', 'b007', 5, 'Excellent hospital facilities and service', DATE '2024-01-25');
INSERT INTO Feedback VALUES ('f008', 'p006', 'doctor', 'doc006', 3, 'Treatment was effective but communication could be better', DATE '2024-01-21');
INSERT INTO Feedback VALUES ('f009', 'p009', 'staff', 'st009', 5, 'Surgery team was outstanding', DATE '2024-01-24');
INSERT INTO Feedback VALUES ('f010', 'p004', 'hospital', 'b002', 2, 'Long waiting times, needs improvement', DATE '2024-01-19');

-- 28. Insurance Providers
INSERT INTO Insurance_Providers VALUES ('ip001', 'HealthFirst Insurance', 'contact@healthfirst.com, +1-800-111-1111');
INSERT INTO Insurance_Providers VALUES ('ip002', 'MediCare Plus', 'info@medicareplus.com, +1-800-222-2222');
INSERT INTO Insurance_Providers VALUES ('ip003', 'United Health Group', 'support@uhg.com, +1-800-333-3333');
INSERT INTO Insurance_Providers VALUES ('ip004', 'Blue Cross Shield', 'service@bcbs.com, +1-800-444-4444');
INSERT INTO Insurance_Providers VALUES ('ip005', 'Aetna Insurance', 'help@aetna.com, +1-800-555-5555');
INSERT INTO Insurance_Providers VALUES ('ip006', 'Cigna Healthcare', 'contact@cigna.com, +1-800-666-6666');
INSERT INTO Insurance_Providers VALUES ('ip007', 'Humana Insurance', 'info@humana.com, +1-800-777-7777');
INSERT INTO Insurance_Providers VALUES ('ip008', 'Kaiser Permanente', 'support@kp.com, +1-800-888-8888');
INSERT INTO Insurance_Providers VALUES ('ip009', 'Anthem Insurance', 'service@anthem.com, +1-800-999-9999');
INSERT INTO Insurance_Providers VALUES ('ip010', 'MetLife Health', 'help@metlife.com, +1-800-101-1010');

-- 29. Patient Insurance
INSERT INTO Patient_Insurance VALUES ('pi001', 'p001', 'ip001', 'HF123456789', 'Full coverage including emergency care, surgery, and medications');
INSERT INTO Patient_Insurance VALUES ('pi002', 'p002', 'ip002', 'MP987654321', 'Basic coverage with 80% reimbursement on treatments');
INSERT INTO Patient_Insurance VALUES ('pi003', 'p003', 'ip003', 'UH456789123', 'Premium coverage including dental and vision');
INSERT INTO Patient_Insurance VALUES ('pi004', 'p004', 'ip004', 'BC789123456', 'Standard coverage with $500 deductible');
INSERT INTO Patient_Insurance VALUES ('pi005', 'p005', 'ip005', 'AE123789456', 'Comprehensive coverage including alternative medicine');
INSERT INTO Patient_Insurance VALUES ('pi006', 'p006', 'ip006', 'CG456123789', 'Cancer treatment specialized coverage');
INSERT INTO Patient_Insurance VALUES ('pi007', 'p007', 'ip007', 'HU789456123', 'Senior citizen health plan');
INSERT INTO Patient_Insurance VALUES ('pi008', 'p008', 'ip008', 'KP123456987', 'Diabetes management specialized plan');
INSERT INTO Patient_Insurance VALUES ('pi009', 'p009', 'ip009', 'AN987123654', 'Surgical procedures coverage');
INSERT INTO Patient_Insurance VALUES ('pi010', 'p010', 'ip010', 'ML654987321', 'Family health coverage plan');

-- 30. Claims
INSERT INTO Claims VALUES ('c001', 'a001', 'ip001', 'Approved', 150.00, DATE '2024-01-16');
INSERT INTO Claims VALUES ('c002', 'a002', 'ip002', 'Approved', 200.40, DATE '2024-01-17');
INSERT INTO Claims VALUES ('c003', 'a003', 'ip003', 'Pending', 1200.00, DATE '2024-01-18');
INSERT INTO Claims VALUES ('c004', 'a005', 'ip005', 'Approved', 240.20, DATE '2024-01-20');
INSERT INTO Claims VALUES ('c005', 'a006', 'ip006', 'Under Review', 1600.00, DATE '2024-01-21');
INSERT INTO Claims VALUES ('c006', 'a007', 'ip007', 'Approved', 400.60, DATE '2024-01-22');
INSERT INTO Claims VALUES ('c007', 'a008', 'ip008', 'Pending', 144.00, DATE '2024-01-23');
INSERT INTO Claims VALUES ('c008', 'a009', 'ip009', 'Under Review', 2400.00, DATE '2024-01-24');
INSERT INTO Claims VALUES ('c009', 'a010', 'ip010', 'Approved', 100.40, DATE '2024-01-25');
INSERT INTO Claims VALUES ('c010', 'a001', 'ip001', 'Rejected', 0.00, DATE '2024-01-17');

COMMIT;