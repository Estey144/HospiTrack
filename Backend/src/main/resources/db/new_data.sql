-- Extended Hospital Management System Sample Data
-- Additional data to populate the existing schema

-- Additional Users (Doctors)
INSERT INTO Users VALUES ('u021', 'Dr. Rashida Begum', 'rashida.begum@hospital.com', 'password123', '+8801710000021', DATE '2023-05-15', 'doctor');
INSERT INTO Users VALUES ('u022', 'Dr. Mizanur Rahman', 'mizanur.rahman@hospital.com', 'password123', '+8801710000022', DATE '2023-05-20', 'doctor');
INSERT INTO Users VALUES ('u023', 'Dr. Sultana Razia', 'sultana.razia@hospital.com', 'password123', '+8801710000023', DATE '2023-06-01', 'doctor');
INSERT INTO Users VALUES ('u024', 'Dr. Golam Mostafa', 'golam.mostafa@hospital.com', 'password123', '+8801710000024', DATE '2023-06-10', 'doctor');
INSERT INTO Users VALUES ('u025', 'Dr. Nasreen Akhter', 'nasreen.akhter@hospital.com', 'password123', '+8801710000025', DATE '2023-06-15', 'doctor');
INSERT INTO Users VALUES ('u026', 'Dr. Abul Bashar', 'abul.bashar@hospital.com', 'password123', '+8801710000026', DATE '2023-07-01', 'doctor');
INSERT INTO Users VALUES ('u027', 'Dr. Salma Khatun', 'salma.khatun@hospital.com', 'password123', '+8801710000027', DATE '2023-07-05', 'doctor');
INSERT INTO Users VALUES ('u028', 'Dr. Jahangir Alam', 'jahangir.alam@hospital.com', 'password123', '+8801710000028', DATE '2023-07-10', 'doctor');
INSERT INTO Users VALUES ('u029', 'Dr. Rokeya Sultana', 'rokeya.sultana@hospital.com', 'password123', '+8801710000029', DATE '2023-07-15', 'doctor');
INSERT INTO Users VALUES ('u030', 'Dr. Kamrul Hasan', 'kamrul.hasan@hospital.com', 'password123', '+8801710000030', DATE '2023-08-01', 'doctor');

-- Additional Patients (Users)
INSERT INTO Users VALUES ('u031', 'Ruma Akter', 'ruma.akter@mail.com', 'password123', '+8801710000031', DATE '2023-02-01', 'patient');
INSERT INTO Users VALUES ('u032', 'Karim Uddin', 'karim.uddin@mail.com', 'password123', '+8801710000032', DATE '2023-02-03', 'patient');
INSERT INTO Users VALUES ('u033', 'Shahida Begum', 'shahida.begum@mail.com', 'password123', '+8801710000033', DATE '2023-02-05', 'patient');
INSERT INTO Users VALUES ('u034', 'Monir Hossain', 'monir.hossain@mail.com', 'password123', '+8801710000034', DATE '2023-02-07', 'patient');
INSERT INTO Users VALUES ('u035', 'Fatima Khatun', 'fatima.khatun@mail.com', 'password123', '+8801710000035', DATE '2023-02-09', 'patient');
INSERT INTO Users VALUES ('u036', 'Abdul Mannan', 'abdul.mannan@mail.com', 'password123', '+8801710000036', DATE '2023-02-11', 'patient');
INSERT INTO Users VALUES ('u037', 'Rashida Parvin', 'rashida.parvin@mail.com', 'password123', '+8801710000037', DATE '2023-02-13', 'patient');
INSERT INTO Users VALUES ('u038', 'Mokbul Hossain', 'mokbul.hossain@mail.com', 'password123', '+8801710000038', DATE '2023-02-15', 'patient');
INSERT INTO Users VALUES ('u039', 'Nasir Ahmed', 'nasir.ahmed@mail.com', 'password123', '+8801710000039', DATE '2023-02-17', 'patient');
INSERT INTO Users VALUES ('u040', 'Amina Begum', 'amina.begum@mail.com', 'password123', '+8801710000040', DATE '2023-02-19', 'patient');
INSERT INTO Users VALUES ('u041', 'Zakir Hossain', 'zakir.hossain@mail.com', 'password123', '+8801710000041', DATE '2023-02-21', 'patient');
INSERT INTO Users VALUES ('u042', 'Salma Begum', 'salma.begum@mail.com', 'password123', '+8801710000042', DATE '2023-02-23', 'patient');
INSERT INTO Users VALUES ('u043', 'Nur Muhammad', 'nur.muhammad@mail.com', 'password123', '+8801710000043', DATE '2023-02-25', 'patient');
INSERT INTO Users VALUES ('u044', 'Rashida Khatun', 'rashida.khatun@mail.com', 'password123', '+8801710000044', DATE '2023-02-27', 'patient');
INSERT INTO Users VALUES ('u045', 'Hafiz Rahman', 'hafiz.rahman@mail.com', 'password123', '+8801710000045', DATE '2023-03-01', 'patient');

-- Additional Staff
INSERT INTO Users VALUES ('s006', 'Nurse Fatema Begum', 'fatema.begum@hospital.com', 'password123', '+8801710000046', DATE '2023-01-15', 'staff');
INSERT INTO Users VALUES ('s007', 'Technician Rafiq Ahmed', 'rafiq.ahmed@hospital.com', 'password123', '+8801710000047', DATE '2023-01-17', 'staff');
INSERT INTO Users VALUES ('s008', 'Admin Shahana Parvin', 'shahana.parvin@hospital.com', 'password123', '+8801710000048', DATE '2023-01-19', 'admin');
INSERT INTO Users VALUES ('s009', 'Nurse Rehana Khatun', 'rehana.khatun@hospital.com', 'password123', '+8801710000049', DATE '2023-01-21', 'staff');
INSERT INTO Users VALUES ('s010', 'Technician Mamun Rahman', 'mamun.rahman@hospital.com', 'password123', '+8801710000050', DATE '2023-01-23', 'staff');
commit;
-- Additional Branch Contacts
INSERT INTO Branch_Contacts VALUES ('bc011', 'b008', '+1234567011', 'main');
INSERT INTO Branch_Contacts VALUES ('bc012', 'b008', '+1234567012', 'emergency');
INSERT INTO Branch_Contacts VALUES ('bc013', 'b009', '+1234567013', 'main');
INSERT INTO Branch_Contacts VALUES ('bc014', 'b009', '+1234567014', 'emergency');
INSERT INTO Branch_Contacts VALUES ('bc015', 'b010', '+1234567015', 'main');
INSERT INTO Branch_Contacts VALUES ('bc016', 'b010', '+1234567016', 'emergency');
INSERT INTO Branch_Contacts VALUES ('bc017', 'b001', '+1234567017', 'appointment');
INSERT INTO Branch_Contacts VALUES ('bc018', 'b002', '+1234567018', 'appointment');
INSERT INTO Branch_Contacts VALUES ('bc019', 'b003', '+1234567019', 'appointment');
INSERT INTO Branch_Contacts VALUES ('bc020', 'b004', '+1234567020', 'appointment');

-- Additional Staff Records
INSERT INTO Staff VALUES ('st011', 's006', 'd004', 'Pediatric Nurse', 'b001');
INSERT INTO Staff VALUES ('st012', 's007', 'd010', 'Senior Radiology Technician', 'b002');
INSERT INTO Staff VALUES ('st013', 's008', 'd001', 'Cardiology Administrator', 'b003');
INSERT INTO Staff VALUES ('st014', 's009', 'd007', 'Emergency Head Nurse', 'b004');
INSERT INTO Staff VALUES ('st015', 's010', 'd009', 'Surgery Technician', 'b005');
INSERT INTO Staff VALUES ('st016', 's006', 'd002', 'Neurology Specialist Nurse', 'b006');
INSERT INTO Staff VALUES ('st017', 's007', 'd003', 'Orthopedic Technician', 'b007');
INSERT INTO Staff VALUES ('st018', 's008', 'd005', 'Dermatology Coordinator', 'b008');
INSERT INTO Staff VALUES ('st019', 's009', 'd006', 'Oncology Head Nurse', 'b009');
INSERT INTO Staff VALUES ('st020', 's010', 'd008', 'Internal Medicine Technician', 'b010');

-- Additional Doctors
INSERT INTO Doctors VALUES ('doc011', 'u021', 'b008', 'MD12355', 18, '8:00 AM - 4:00 PM', 'd001', 'https://labaid.com.bd/files/images/1579434177.jpg');
INSERT INTO Doctors VALUES ('doc012', 'u022', 'b008', 'MD12356', 22, '9:00 AM - 5:00 PM', 'd002', 'https://labaid.com.bd/files/images/1700977408.jpg');
INSERT INTO Doctors VALUES ('doc013', 'u023', 'b009', 'MD12357', 16, '10:00 AM - 6:00 PM', 'd003', 'https://labaid.com.bd/files/images/1579584541.jpg');
INSERT INTO Doctors VALUES ('doc014', 'u024', 'b009', 'MD12358', 14, '7:00 AM - 3:00 PM', 'd004', 'https://labaid.com.bd/files/images/1700981329.jpg');
INSERT INTO Doctors VALUES ('doc015', 'u025', 'b010', 'MD12359', 19, '8:30 AM - 4:30 PM', 'd005', 'https://labaid.com.bd/files/images/1717561783.jpg');
INSERT INTO Doctors VALUES ('doc016', 'u026', 'b010', 'MD12360', 25, '9:30 AM - 5:30 PM', 'd006', 'https://labaid.com.bd/files/images/1700983333.jpg');
INSERT INTO Doctors VALUES ('doc017', 'u027', 'b001', 'MD12361', 12, '11:00 AM - 7:00 PM', 'd007', 'https://labaid.com.bd/files/images/1717563358.jpg');
INSERT INTO Doctors VALUES ('doc018', 'u028', 'b002', 'MD12362', 17, '6:00 AM - 2:00 PM', 'd008', 'https://labaid.com.bd/files/images/1579688497.jpg');
INSERT INTO Doctors VALUES ('doc019', 'u029', 'b003', 'MD12363', 21, '2:00 PM - 10:00 PM', 'd009', 'https://labaid.com.bd/files/images/1611551203.jpg');
INSERT INTO Doctors VALUES ('doc020', 'u030', 'b004', 'MD12364', 13, '8:00 AM - 4:00 PM', 'd010', 'https://labaid.com.bd/files/images/1700978514.jpg');

-- Additional Patients
INSERT INTO Patients VALUES ('p011', 'u031', DATE '1988-07-12', 'Female', 'O+', '45 Eskaton Garden, Dhaka', '+8801711000011');
INSERT INTO Patients VALUES ('p012', 'u032', DATE '1975-11-28', 'Male', 'A+', '67 New Market Area, Dhaka', '+8801711000012');
INSERT INTO Patients VALUES ('p013', 'u033', DATE '1982-04-15', 'Female', 'B-', '89 Wari, Dhaka', '+8801711000013');
INSERT INTO Patients VALUES ('p014', 'u034', DATE '1995-09-03', 'Male', 'AB-', '12 Tejgaon, Dhaka', '+8801711000014');
INSERT INTO Patients VALUES ('p015', 'u035', DATE '1979-12-20', 'Female', 'O-', '34 Rampura, Dhaka', '+8801711000015');
INSERT INTO Patients VALUES ('p016', 'u036', DATE '1992-02-14', 'Male', 'A-', '56 Motijheel, Dhaka', '+8801711000016');
INSERT INTO Patients VALUES ('p017', 'u037', DATE '1984-08-07', 'Female', 'B+', '78 Paltan, Dhaka', '+8801711000017');
INSERT INTO Patients VALUES ('p018', 'u038', DATE '1991-01-25', 'Male', 'AB+', '90 Shantinagar, Dhaka', '+8801711000018');
INSERT INTO Patients VALUES ('p019', 'u039', DATE '1987-06-11', 'Male', 'O+', '23 Malibagh, Dhaka', '+8801711000019');
INSERT INTO Patients VALUES ('p020', 'u040', DATE '1993-10-29', 'Female', 'A+', '45 Segunbagicha, Dhaka', '+8801711000020');
INSERT INTO Patients VALUES ('p021', 'u041', DATE '1986-03-16', 'Male', 'B-', '67 Ramna, Dhaka', '+8801711000021');
INSERT INTO Patients VALUES ('p022', 'u042', DATE '1989-05-08', 'Female', 'AB-', '89 Shahbagh, Dhaka', '+8801711000022');
INSERT INTO Patients VALUES ('p023', 'u043', DATE '1974-12-31', 'Male', 'O-', '12 Purana Paltan, Dhaka', '+8801711000023');
INSERT INTO Patients VALUES ('p024', 'u044', DATE '1997-07-04', 'Female', 'A-', '34 Kakrail, Dhaka', '+8801711000024');
INSERT INTO Patients VALUES ('p025', 'u045', DATE '1981-09-22', 'Male', 'B+', '56 Mogbazar, Dhaka', '+8801711000025');

-- Additional Rooms
INSERT INTO Rooms VALUES ('r011', '301', 'Standard', 'Available');
INSERT INTO Rooms VALUES ('r012', '302', 'Deluxe', 'Available');
INSERT INTO Rooms VALUES ('r013', '303', 'ICU', 'Occupied');
INSERT INTO Rooms VALUES ('r014', '304', 'Emergency', 'Available');
INSERT INTO Rooms VALUES ('r015', '305', 'Standard', 'Available');
INSERT INTO Rooms VALUES ('r016', '401', 'Deluxe', 'Maintenance');
INSERT INTO Rooms VALUES ('r017', '402', 'Standard', 'Available');
INSERT INTO Rooms VALUES ('r018', '403', 'ICU', 'Available');
INSERT INTO Rooms VALUES ('r019', '404', 'Emergency', 'Occupied');
INSERT INTO Rooms VALUES ('r020', '405', 'Standard', 'Available');
INSERT INTO Rooms VALUES ('r021', '501', 'Premium', 'Available');
INSERT INTO Rooms VALUES ('r022', '502', 'Premium', 'Occupied');
INSERT INTO Rooms VALUES ('r023', '503', 'VIP', 'Available');
INSERT INTO Rooms VALUES ('r024', '504', 'VIP', 'Available');
INSERT INTO Rooms VALUES ('r025', '505', 'Premium', 'Available');

-- Additional Appointments
INSERT INTO Appointments VALUES ('a011', 'p011', 'doc011', DATE '2024-01-25', '09:00 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a012', 'p012', 'doc012', DATE '2024-01-26', '10:00 AM', 'Follow-up', 'Scheduled');
INSERT INTO Appointments VALUES ('a013', 'p013', 'doc013', DATE '2024-01-27', '11:00 AM', 'Surgery', 'Scheduled');
INSERT INTO Appointments VALUES ('a014', 'p014', 'doc014', DATE '2024-01-28', '02:00 PM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a015', 'p015', 'doc015', DATE '2024-01-29', '03:00 PM', 'Screening', 'Scheduled');
INSERT INTO Appointments VALUES ('a016', 'p016', 'doc016', DATE '2024-01-30', '09:30 AM', 'Treatment', 'Scheduled');
INSERT INTO Appointments VALUES ('a017', 'p017', 'doc017', DATE '2024-01-31', '10:30 AM', 'Emergency', 'Completed');
INSERT INTO Appointments VALUES ('a018', 'p018', 'doc018', DATE '2024-02-01', '11:30 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a019', 'p019', 'doc019', DATE '2024-02-02', '01:00 PM', 'Surgery', 'Scheduled');
INSERT INTO Appointments VALUES ('a020', 'p020', 'doc020', DATE '2024-02-03', '02:30 PM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a021', 'p021', 'doc001', DATE '2024-02-04', '09:00 AM', 'Follow-up', 'Scheduled');
INSERT INTO Appointments VALUES ('a022', 'p022', 'doc002', DATE '2024-02-05', '10:00 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a023', 'p023', 'doc003', DATE '2024-02-06', '11:00 AM', 'Treatment', 'Scheduled');
INSERT INTO Appointments VALUES ('a024', 'p024', 'doc004', DATE '2024-02-07', '02:00 PM', 'Screening', 'Scheduled');
INSERT INTO Appointments VALUES ('a025', 'p025', 'doc005', DATE '2024-02-08', '03:00 PM', 'Consultation', 'Scheduled');

-- Additional Cabin assignments
INSERT INTO Cabin VALUES ('c011', 'doc011', 'r011', 'a011');
INSERT INTO Cabin VALUES ('c012', 'doc012', 'r012', 'a012');
INSERT INTO Cabin VALUES ('c013', 'doc013', 'r013', 'a013');
INSERT INTO Cabin VALUES ('c014', 'doc014', 'r014', 'a014');
INSERT INTO Cabin VALUES ('c015', 'doc015', 'r015', 'a015');
INSERT INTO Cabin VALUES ('c016', 'doc016', 'r017', 'a016');
INSERT INTO Cabin VALUES ('c017', 'doc017', 'r018', 'a017');
INSERT INTO Cabin VALUES ('c018', 'doc018', 'r019', 'a018');
INSERT INTO Cabin VALUES ('c019', 'doc019', 'r020', 'a019');
INSERT INTO Cabin VALUES ('c020', 'doc020', 'r021', 'a020');

-- Additional Room Assignments
INSERT INTO Room_Assignments VALUES ('ra011', 'r013', 'p013', DATE '2024-01-27', DATE '2024-01-29', 'Active');
INSERT INTO Room_Assignments VALUES ('ra012', 'r022', 'p022', DATE '2024-02-05', DATE '2024-02-07', 'Scheduled');
INSERT INTO Room_Assignments VALUES ('ra013', 'r019', 'p018', DATE '2024-02-01', DATE '2024-02-03', 'Active');
INSERT INTO Room_Assignments VALUES ('ra014', 'r011', 'p011', DATE '2024-01-25', DATE '2024-01-26', 'Scheduled');
INSERT INTO Room_Assignments VALUES ('ra015', 'r012', 'p012', DATE '2024-01-26', DATE '2024-01-27', 'Scheduled');
INSERT INTO Room_Assignments VALUES ('ra016', 'r015', 'p015', DATE '2024-01-29', DATE '2024-01-30', 'Scheduled');
INSERT INTO Room_Assignments VALUES ('ra017', 'r017', 'p016', DATE '2024-01-30', DATE '2024-02-01', 'Scheduled');
INSERT INTO Room_Assignments VALUES ('ra018', 'r018', 'p017', DATE '2024-01-31', DATE '2024-02-01', 'Completed');
INSERT INTO Room_Assignments VALUES ('ra019', 'r020', 'p019', DATE '2024-02-02', DATE '2024-02-04', 'Scheduled');
INSERT INTO Room_Assignments VALUES ('ra020', 'r021', 'p020', DATE '2024-02-03', DATE '2024-02-05', 'Scheduled');

-- Additional Medications
INSERT INTO Medications VALUES ('m011', 'Ciprofloxacin', '500mg', '7 days');
INSERT INTO Medications VALUES ('m012', 'Prednisolone', '5mg', '14 days');
INSERT INTO Medications VALUES ('m013', 'Loratadine', '10mg', '10 days');
INSERT INTO Medications VALUES ('m014', 'Ranitidine', '150mg', '14 days');
INSERT INTO Medications VALUES ('m015', 'Diclofenac', '50mg', '7 days');
INSERT INTO Medications VALUES ('m016', 'Cetirizine', '10mg', '7 days');
INSERT INTO Medications VALUES ('m017', 'Simvastatin', '20mg', '30 days');
INSERT INTO Medications VALUES ('m018', 'Losartan', '50mg', '30 days');
INSERT INTO Medications VALUES ('m019', 'Pantoprazole', '40mg', '14 days');
INSERT INTO Medications VALUES ('m020', 'Montelukast', '10mg', '30 days');

-- Additional Prescriptions
INSERT INTO Prescriptions VALUES ('pr011', 'a011', 'doc011', 'p011', 'Take medication with food. Monitor heart rate regularly.', DATE '2024-01-25');
INSERT INTO Prescriptions VALUES ('pr012', 'a012', 'doc012', 'p012', 'Continue medication as prescribed. Schedule MRI follow-up.', DATE '2024-01-26');
INSERT INTO Prescriptions VALUES ('pr013', 'a013', 'doc013', 'p013', 'Pre-operative medications. Stop eating 8 hours before surgery.', DATE '2024-01-27');
INSERT INTO Prescriptions VALUES ('pr014', 'a014', 'doc014', 'p014', 'Pediatric dosage. Give with milk or juice.', DATE '2024-01-28');
INSERT INTO Prescriptions VALUES ('pr015', 'a015', 'doc015', 'p015', 'Apply topical medication twice daily. Avoid harsh soaps.', DATE '2024-01-29');
INSERT INTO Prescriptions VALUES ('pr016', 'a016', 'doc016', 'p016', 'Oncology treatment support. Monitor blood counts weekly.', DATE '2024-01-30');
INSERT INTO Prescriptions VALUES ('pr017', 'a017', 'doc017', 'p017', 'Emergency treatment completed. Continue pain management.', DATE '2024-01-31');
INSERT INTO Prescriptions VALUES ('pr018', 'a018', 'doc018', 'p018', 'Gastric medication. Take 30 minutes before meals.', DATE '2024-02-01');
INSERT INTO Prescriptions VALUES ('pr019', 'a019', 'doc019', 'p019', 'Post-surgical care instructions. Keep wound dry and clean.', DATE '2024-02-02');
INSERT INTO Prescriptions VALUES ('pr020', 'a020', 'doc020', 'p020', 'Radiology follow-up required. Continue current treatment.', DATE '2024-02-03');

-- Additional Prescription-Medication relationships
INSERT INTO Pres_Med VALUES ('pm011', 'pr011', 'm001');
INSERT INTO Pres_Med VALUES ('pm012', 'pr011', 'm006');
INSERT INTO Pres_Med VALUES ('pm013', 'pr012', 'm012');
INSERT INTO Pres_Med VALUES ('pm014', 'pr012', 'm009');
INSERT INTO Pres_Med VALUES ('pm015', 'pr013', 'm002');
INSERT INTO Pres_Med VALUES ('pm016', 'pr013', 'm011');
INSERT INTO Pres_Med VALUES ('pm017', 'pr014', 'm002');
INSERT INTO Pres_Med VALUES ('pm018', 'pr015', 'm013');
INSERT INTO Pres_Med VALUES ('pm019', 'pr015', 'm016');
INSERT INTO Pres_Med VALUES ('pm020', 'pr016', 'm008');
INSERT INTO Pres_Med VALUES ('pm021', 'pr016', 'm012');
INSERT INTO Pres_Med VALUES ('pm022', 'pr017', 'm004');
INSERT INTO Pres_Med VALUES ('pm023', 'pr017', 'm015');
INSERT INTO Pres_Med VALUES ('pm024', 'pr018', 'm014');
INSERT INTO Pres_Med VALUES ('pm025', 'pr018', 'm019');

-- Additional Lab Tests
INSERT INTO Lab_Tests VALUES ('lt011', 'p011', 'ECG', DATE '2024-01-25', 'Normal sinus rhythm', 'doc011', 'https://example.com/lab11.pdf');
INSERT INTO Lab_Tests VALUES ('lt012', 'p012', 'CT Scan Brain', DATE '2024-01-26', 'No abnormalities detected', 'doc012', 'https://example.com/lab12.pdf');
INSERT INTO Lab_Tests VALUES ('lt013', 'p013', 'Bone Density', DATE '2024-01-27', 'Osteopenia detected', 'doc013', 'https://example.com/lab13.pdf');
INSERT INTO Lab_Tests VALUES ('lt014', 'p014', 'Complete Blood Count', DATE '2024-01-28', 'All parameters normal', 'doc014', 'https://example.com/lab14.pdf');
INSERT INTO Lab_Tests VALUES ('lt015', 'p015', 'Allergy Panel', DATE '2024-01-29', 'Multiple allergies detected', 'doc015', 'https://example.com/lab15.pdf');
INSERT INTO Lab_Tests VALUES ('lt016', 'p016', 'Tumor Markers', DATE '2024-01-30', 'Elevated CA 125', 'doc016', 'https://example.com/lab16.pdf');
INSERT INTO Lab_Tests VALUES ('lt017', 'p017', 'Coagulation Profile', DATE '2024-01-31', 'Normal clotting factors', 'doc017', 'https://example.com/lab17.pdf');
INSERT INTO Lab_Tests VALUES ('lt018', 'p018', 'Liver Function Test', DATE '2024-02-01', 'Mild elevation in ALT', 'doc018', 'https://example.com/lab18.pdf');
INSERT INTO Lab_Tests VALUES ('lt019', 'p019', 'Cardiac Enzymes', DATE '2024-02-02', 'Normal troponin levels', 'doc019', 'https://example.com/lab19.pdf');
INSERT INTO Lab_Tests VALUES ('lt020', 'p020', 'Kidney Function', DATE '2024-02-03', 'Creatinine slightly elevated', 'doc020', 'https://example.com/lab20.pdf');

-- Additional Bills
INSERT INTO Bills VALUES ('b011', 'p011', 'a011', 200.00, 'Pending', DATE '2024-01-25');
INSERT INTO Bills VALUES ('b012', 'p012', 'a012', 350.75, 'Pending', DATE '2024-01-26');
INSERT INTO Bills VALUES ('b013', 'p013', 'a013', 2500.00, 'Pending', DATE '2024-01-27');
INSERT INTO Bills VALUES ('b014', 'p014', 'a014', 125.50, 'Pending', DATE '2024-01-28');
INSERT INTO Bills VALUES ('b015', 'p015', 'a015', 450.25, 'Pending', DATE '2024-01-29');
INSERT INTO Bills VALUES ('b016', 'p016', 'a016', 3200.00, 'Pending', DATE '2024-01-30');
INSERT INTO Bills VALUES ('b017', 'p017', 'a017', 800.75, 'Paid', DATE '2024-01-31');
INSERT INTO Bills VALUES ('b018', 'p018', 'a018', 275.00, 'Pending', DATE '2024-02-01');
INSERT INTO Bills VALUES ('b019', 'p019', 'a019', 4500.00, 'Pending', DATE '2024-02-02');
INSERT INTO Bills VALUES ('b020', 'p020', 'a020', 180.50, 'Pending', DATE '2024-02-03');

-- Additional Bill Items
INSERT INTO Bill_Items VALUES ('bi011', 'b011', 'Cardiology Consultation', 150.00);
INSERT INTO Bill_Items VALUES ('bi012', 'b011', 'ECG Test', 50.00);
INSERT INTO Bill_Items VALUES ('bi013', 'b012', 'Neurology Consultation', 150.75);
INSERT INTO Bill_Items VALUES ('bi014', 'b012', 'CT Scan', 200.00);
INSERT INTO Bill_Items VALUES ('bi015', 'b013', 'Orthopedic Surgery', 2000.00);
INSERT INTO Bill_Items VALUES ('bi016', 'b013', 'Anesthesia', 300.00);
INSERT INTO Bill_Items VALUES ('bi017', 'b013', 'Room Charges', 200.00);
INSERT INTO Bill_Items VALUES ('bi018', 'b014', 'Pediatric Consultation', 100.50);
INSERT INTO Bill_Items VALUES ('bi019', 'b014', 'Lab Tests', 25.00);
INSERT INTO Bill_Items VALUES ('bi020', 'b015', 'Dermatology Consultation', 200.25);

-- Additional Specializations
INSERT INTO Specializations VALUES ('sp011', 'Electrophysiology', 'Heart rhythm disorders and pacemaker management');
INSERT INTO Specializations VALUES ('sp012', 'Stroke Neurology', 'Acute stroke care and rehabilitation');
INSERT INTO Specializations VALUES ('sp013', 'Joint Replacement', 'Hip and knee replacement surgery');
INSERT INTO Specializations VALUES ('sp014', 'Pediatric Emergency', 'Emergency care for children');
INSERT INTO Specializations VALUES ('sp015', 'Mohs Surgery', 'Specialized skin cancer surgery');
INSERT INTO Specializations VALUES ('sp016', 'Hematology Oncology', 'Blood cancers and disorders');
INSERT INTO Specializations VALUES ('sp017', 'Critical Care Medicine', 'Intensive care unit management');
INSERT INTO Specializations VALUES ('sp018', 'Hepatology', 'Liver diseases and transplantation');
INSERT INTO Specializations VALUES ('sp019', 'Vascular Surgery', 'Blood vessel surgery');
INSERT INTO Specializations VALUES ('sp020', 'Nuclear Medicine', 'Radioactive isotope imaging and therapy');

-- Additional Doctor Specializations
INSERT INTO Doctor_Specializations VALUES ('ds011', 'doc011', 'sp011');
INSERT INTO Doctor_Specializations VALUES ('ds012', 'doc012', 'sp012');
INSERT INTO Doctor_Specializations VALUES ('ds013', 'doc013', 'sp013');
INSERT INTO Doctor_Specializations VALUES ('ds014', 'doc014', 'sp014');
INSERT INTO Doctor_Specializations VALUES ('ds015', 'doc015', 'sp015');
INSERT INTO Doctor_Specializations VALUES ('ds016', 'doc016', 'sp016');
INSERT INTO Doctor_Specializations VALUES ('ds017', 'doc017', 'sp017');
INSERT INTO Doctor_Specializations VALUES ('ds018', 'doc018', 'sp018');
INSERT INTO Doctor_Specializations VALUES ('ds019', 'doc019', 'sp019');
INSERT INTO Doctor_Specializations VALUES ('ds020', 'doc020', 'sp020');
-- Additional cross-specializations for existing doctors
INSERT INTO Doctor_Specializations VALUES ('ds021', 'doc001', 'sp011');
INSERT INTO Doctor_Specializations VALUES ('ds022', 'doc002', 'sp012');
INSERT INTO Doctor_Specializations VALUES ('ds023', 'doc003', 'sp013');
INSERT INTO Doctor_Specializations VALUES ('ds024', 'doc005', 'sp015');
INSERT INTO Doctor_Specializations VALUES ('ds025', 'doc006', 'sp016');

-- Additional Audit Log entries
INSERT INTO Audit_Log VALUES ('al011', 'u021', 'CREATE', 'Appointments', DATE '2024-01-25', 'New cardiology appointment scheduled');
INSERT INTO Audit_Log VALUES ('al012', 'u022', 'UPDATE', 'Prescriptions', DATE '2024-01-26', 'Prescription updated for neurological patient');
INSERT INTO Audit_Log VALUES ('al013', 's006', 'CREATE', 'Room_Assignments', DATE '2024-01-27', 'ICU room assigned for surgery patient');
INSERT INTO Audit_Log VALUES ('al014', 'u024', 'CREATE', 'Lab_Tests', DATE '2024-01-28', 'Pediatric blood test ordered');
INSERT INTO Audit_Log VALUES ('al015', 'u025', 'UPDATE', 'Patients', DATE '2024-01-29', 'Patient allergy information updated');
INSERT INTO Audit_Log VALUES ('al016', 's007', 'CREATE', 'Bills', DATE '2024-01-30', 'Oncology treatment bill generated');
INSERT INTO Audit_Log VALUES ('al017', 'u027', 'UPDATE', 'Appointments', DATE '2024-01-31', 'Emergency appointment completed');
INSERT INTO Audit_Log VALUES ('al018', 'u028', 'CREATE', 'Prescriptions', DATE '2024-02-01', 'Gastroenterology prescription issued');
INSERT INTO Audit_Log VALUES ('al019', 'u029', 'CREATE', 'Room_Assignments', DATE '2024-02-02', 'Premium room assigned for surgery');
INSERT INTO Audit_Log VALUES ('al020', 'u030', 'UPDATE', 'Lab_Tests', DATE '2024-02-03', 'Radiology report updated');

-- More Ambulances
INSERT INTO Ambulances VALUES ('amb011', 'AMB-011', 'Available', 'Uttara Branch', 'b008');
INSERT INTO Ambulances VALUES ('amb012', 'AMB-012', 'In Transit', 'Rangpur Branch', 'b009');
INSERT INTO Ambulances VALUES ('amb013', 'AMB-013', 'Available', 'Barisal Branch', 'b010');
INSERT INTO Ambulances VALUES ('amb014', 'AMB-014', 'Maintenance', 'Dhaka Medical Branch', 'b001');
INSERT INTO Ambulances VALUES ('amb015', 'AMB-015', 'Available', 'Mirpur Branch', 'b002');

-- Additional Ambulance Requests
INSERT INTO Ambulance_Requests VALUES ('ar011', 'p011', 'amb011', DATE '2024-01-25', '45 Eskaton Garden, Dhaka', 'Uttara Community Branch', 'Completed');
INSERT INTO Ambulance_Requests VALUES ('ar012', 'p012', 'amb012', DATE '2024-01-26', '67 New Market Area, Dhaka', 'Dhaka Medical Branch', 'In Progress');
INSERT INTO Ambulance_Requests VALUES ('ar013', 'p013', 'amb013', DATE '2024-01-27', '89 Wari, Dhaka', 'Dhaka Medical Branch', 'Completed');
INSERT INTO Ambulance_Requests VALUES ('ar014', 'p014', 'amb015', DATE '2024-01-28', '12 Tejgaon, Dhaka', 'Mirpur Branch', 'Pending');
INSERT INTO Ambulance_Requests VALUES ('ar015', 'p015', 'amb001', DATE '2024-01-29', '34 Rampura, Dhaka', 'Dhaka Medical Branch', 'Completed');
INSERT INTO Ambulance_Requests VALUES ('ar016', 'p016', 'amb002', DATE '2024-01-30', '56 Motijheel, Dhaka', 'Dhaka Medical Branch', 'In Progress');
INSERT INTO Ambulance_Requests VALUES ('ar017', 'p017', 'amb003', DATE '2024-01-31', '78 Paltan, Dhaka', 'Gulshan Branch', 'Completed');
INSERT INTO Ambulance_Requests VALUES ('ar018', 'p018', 'amb004', DATE '2024-02-01', '90 Shantinagar, Dhaka', 'Dhaka Medical Branch', 'Cancelled');
INSERT INTO Ambulance_Requests VALUES ('ar019', 'p019', 'amb005', DATE '2024-02-02', '23 Malibagh, Dhaka', 'Dhaka Medical Branch', 'In Progress');
INSERT INTO Ambulance_Requests VALUES ('ar020', 'p020', 'amb006', DATE '2024-02-03', '45 Segunbagicha, Dhaka', 'Sylhet Central Branch', 'Pending');

-- Additional Device Logs
INSERT INTO Device_Logs VALUES ('dl011', 'p011', 'Blood Pressure Monitor', 'Systolic', '135', DATE '2024-01-25');
INSERT INTO Device_Logs VALUES ('dl012', 'p011', 'Blood Pressure Monitor', 'Diastolic', '85', DATE '2024-01-25');
INSERT INTO Device_Logs VALUES ('dl013', 'p012', 'Heart Rate Monitor', 'BPM', '68', DATE '2024-01-26');
INSERT INTO Device_Logs VALUES ('dl014', 'p013', 'Pulse Oximeter', 'Oxygen Saturation', '96', DATE '2024-01-27');
INSERT INTO Device_Logs VALUES ('dl015', 'p014', 'Thermometer', 'Body Temperature', '99.2', DATE '2024-01-28');
INSERT INTO Device_Logs VALUES ('dl016', 'p015', 'Glucometer', 'Blood Sugar', '95', DATE '2024-01-29');
INSERT INTO Device_Logs VALUES ('dl017', 'p016', 'ECG Monitor', 'Heart Rhythm', 'Irregular', DATE '2024-01-30');
INSERT INTO Device_Logs VALUES ('dl018', 'p017', 'Blood Pressure Monitor', 'Systolic', '110', DATE '2024-01-31');
INSERT INTO Device_Logs VALUES ('dl019', 'p018', 'Pulse Oximeter', 'Oxygen Saturation', '99', DATE '2024-02-01');
INSERT INTO Device_Logs VALUES ('dl020', 'p019', 'Heart Rate Monitor', 'BPM', '92', DATE '2024-02-02');
INSERT INTO Device_Logs VALUES ('dl021', 'p020', 'Glucometer', 'Blood Sugar', '105', DATE '2024-02-03');
INSERT INTO Device_Logs VALUES ('dl022', 'p021', 'Blood Pressure Monitor', 'Systolic', '125', DATE '2024-02-04');
INSERT INTO Device_Logs VALUES ('dl023', 'p022', 'Thermometer', 'Body Temperature', '98.8', DATE '2024-02-05');
INSERT INTO Device_Logs VALUES ('dl024', 'p023', 'Pulse Oximeter', 'Oxygen Saturation', '97', DATE '2024-02-06');
INSERT INTO Device_Logs VALUES ('dl025', 'p024', 'Heart Rate Monitor', 'BPM', '75', DATE '2024-02-07');

-- Additional Video Sessions
INSERT INTO VideoSessions VALUES ('vs011', 'a011', 'https://meet.hospital.com/session11', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs012', 'a012', 'https://meet.hospital.com/session12', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs013', 'a014', 'https://meet.hospital.com/session13', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs014', 'a015', 'https://meet.hospital.com/session14', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs015', 'a016', 'https://meet.hospital.com/session15', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs016', 'a018', 'https://meet.hospital.com/session16', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs017', 'a020', 'https://meet.hospital.com/session17', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs018', 'a021', 'https://meet.hospital.com/session18', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs019', 'a022', 'https://meet.hospital.com/session19', 'Scheduled');
INSERT INTO VideoSessions VALUES ('vs020', 'a025', 'https://meet.hospital.com/session20', 'Scheduled');

-- Additional Chat Logs
INSERT INTO ChatLogs VALUES ('cl011', 'a011', 'u031', 'I have been experiencing irregular heartbeat lately.', DATE '2024-01-25');
INSERT INTO ChatLogs VALUES ('cl012', 'a011', 'u021', 'We need to do an ECG to check your heart rhythm. Have you been under stress?', DATE '2024-01-25');
INSERT INTO ChatLogs VALUES ('cl013', 'a012', 'u032', 'The headaches are getting worse, doctor.', DATE '2024-01-26');
INSERT INTO ChatLogs VALUES ('cl014', 'a012', 'u022', 'I recommend we do a CT scan to rule out any serious issues.', DATE '2024-01-26');
INSERT INTO ChatLogs VALUES ('cl015', 'a014', 'u034', 'My child has been running a fever for two days.', DATE '2024-01-28');
INSERT INTO ChatLogs VALUES ('cl016', 'a014', 'u024', 'Let''s check the temperature and do some blood work to find the cause.', DATE '2024-01-28');
INSERT INTO ChatLogs VALUES ('cl017', 'a015', 'u035', 'The skin rash is spreading and very itchy.', DATE '2024-01-29');
INSERT INTO ChatLogs VALUES ('cl018', 'a015', 'u025', 'This looks like an allergic reaction. We''ll do an allergy panel test.', DATE '2024-01-29');
INSERT INTO ChatLogs VALUES ('cl019', 'a018', 'u038', 'I''ve been having severe stomach pain after eating.', DATE '2024-02-01');
INSERT INTO ChatLogs VALUES ('cl020', 'a018', 'u028', 'We need to examine your digestive system. I''ll prescribe some medication.', DATE '2024-02-01');

-- Additional Symptom Checker entries
INSERT INTO Symptom_Checker VALUES ('sc011', 'p011', 'Irregular heartbeat, dizziness, chest tightness', 'Possible arrhythmia, recommend cardiology consultation', DATE '2024-01-24');
INSERT INTO Symptom_Checker VALUES ('sc012', 'p012', 'Severe headache, nausea, sensitivity to light', 'Possible migraine or neurological issue, recommend immediate consultation', DATE '2024-01-25');
INSERT INTO Symptom_Checker VALUES ('sc013', 'p013', 'Bone pain, joint stiffness, difficulty walking', 'Possible osteoporosis or arthritis, recommend bone density test', DATE '2024-01-26');
INSERT INTO Symptom_Checker VALUES ('sc014', 'p014', 'High fever, loss of appetite, fatigue', 'Possible infection, recommend blood tests and consultation', DATE '2024-01-27');
INSERT INTO Symptom_Checker VALUES ('sc015', 'p015', 'Skin rash, swelling, difficulty breathing', 'Possible severe allergic reaction, seek immediate medical attention', DATE '2024-01-28');
INSERT INTO Symptom_Checker VALUES ('sc016', 'p016', 'Unexplained weight loss, abdominal pain, loss of appetite', 'Requires immediate oncology consultation, possible serious condition', DATE '2024-01-29');
INSERT INTO Symptom_Checker VALUES ('sc017', 'p017', 'Chest pain, shortness of breath, rapid heartbeat', 'Possible cardiac emergency, seek immediate care', DATE '2024-01-30');
INSERT INTO Symptom_Checker VALUES ('sc018', 'p018', 'Stomach pain, nausea, loss of appetite', 'Possible gastric issue, recommend gastroenterology consultation', DATE '2024-01-31');
INSERT INTO Symptom_Checker VALUES ('sc019', 'p019', 'Leg pain, swelling, discoloration', 'Possible vascular issue, recommend vascular surgery consultation', DATE '2024-02-01');
INSERT INTO Symptom_Checker VALUES ('sc020', 'p020', 'Fatigue, weakness, frequent infections', 'Possible immune system issue, recommend comprehensive blood work', DATE '2024-02-02');

-- Additional Feedback
INSERT INTO Feedback VALUES ('f011', 'p011', 'doctor', 'doc011', 5, 'Dr. Rashida was very thorough and explained everything clearly', DATE '2024-01-26');
INSERT INTO Feedback VALUES ('f012', 'p012', 'doctor', 'doc012', 4, 'Good consultation but waiting time was long', DATE '2024-01-27');
INSERT INTO Feedback VALUES ('f013', 'p013', 'hospital', 'b009', 4, 'Clean facilities and helpful staff', DATE '2024-01-28');
INSERT INTO Feedback VALUES ('f014', 'p014', 'doctor', 'doc014', 5, 'Excellent pediatrician, very gentle with children', DATE '2024-01-29');
INSERT INTO Feedback VALUES ('f015', 'p015', 'staff', 'st011', 4, 'Nursing staff was professional and caring', DATE '2024-01-30');
INSERT INTO Feedback VALUES ('f016', 'p016', 'doctor', 'doc016', 3, 'Treatment was effective but doctor seemed rushed', DATE '2024-01-31');
INSERT INTO Feedback VALUES ('f017', 'p017', 'hospital', 'b004', 5, 'Emergency department was well-organized and efficient', DATE '2024-02-01');
INSERT INTO Feedback VALUES ('f018', 'p018', 'doctor', 'doc018', 4, 'Doctor was knowledgeable and provided good advice', DATE '2024-02-02');
INSERT INTO Feedback VALUES ('f019', 'p019', 'staff', 'st015', 5, 'Surgery team was excellent and supportive', DATE '2024-02-03');
INSERT INTO Feedback VALUES ('f020', 'p020', 'hospital', 'b004', 3, 'Good facilities but parking was difficult', DATE '2024-02-04');

-- Additional Insurance Providers
INSERT INTO Insurance_Providers VALUES ('ip011', 'Alpha Insurance Ltd.', 'contact@alphainsurance.com.bd, +8809609009876');
INSERT INTO Insurance_Providers VALUES ('ip012', 'United Insurance Co.', 'info@unitedinsurance.com.bd, +8809612008765');
INSERT INTO Insurance_Providers VALUES ('ip013', 'Prime Insurance Ltd.', 'support@primeinsurance.com.bd, +8809612007654');
INSERT INTO Insurance_Providers VALUES ('ip014', 'Global Insurance Co.', 'service@globalinsurance.com.bd, +8809612006543');
INSERT INTO Insurance_Providers VALUES ('ip015', 'Trust Insurance Ltd.', 'help@trustinsurance.com.bd, +8809612005432');

-- Additional Patient Insurance
INSERT INTO Patient_Insurance VALUES ('pi011', 'p011', 'ip011', 'AI789012345', 'Cardiac care specialized coverage with full reimbursement');
INSERT INTO Patient_Insurance VALUES ('pi012', 'p012', 'ip012', 'UI678901234', 'Neurological disorders coverage with 90% reimbursement');
INSERT INTO Patient_Insurance VALUES ('pi013', 'p013', 'ip013', 'PI567890123', 'Orthopedic and rehabilitation coverage');
INSERT INTO Patient_Insurance VALUES ('pi014', 'p014', 'ip014', 'GI456789012', 'Pediatric health insurance with family coverage');
INSERT INTO Patient_Insurance VALUES ('pi015', 'p015', 'ip015', 'TI345678901', 'Dermatology and allergy treatment coverage');
INSERT INTO Patient_Insurance VALUES ('pi016', 'p016', 'ip001', 'HF234567890', 'Oncology treatment specialized plan');
INSERT INTO Patient_Insurance VALUES ('pi017', 'p017', 'ip002', 'MP123456789', 'Emergency care and trauma coverage');
INSERT INTO Patient_Insurance VALUES ('pi018', 'p018', 'ip003', 'UH012345678', 'Gastroenterology specialized coverage');
INSERT INTO Patient_Insurance VALUES ('pi019', 'p019', 'ip004', 'BC901234567', 'Surgical procedures comprehensive plan');
INSERT INTO Patient_Insurance VALUES ('pi020', 'p020', 'ip005', 'AE890123456', 'Kidney and renal care coverage');

-- Additional Claims
INSERT INTO Claims VALUES ('c011', 'a011', 'ip011', 'Pending', 200.00, DATE '2024-01-26');
INSERT INTO Claims VALUES ('c012', 'a012', 'ip012', 'Under Review', 315.68, DATE '2024-01-27');
INSERT INTO Claims VALUES ('c013', 'a013', 'ip013', 'Approved', 2000.00, DATE '2024-01-28');
INSERT INTO Claims VALUES ('c014', 'a014', 'ip014', 'Approved', 100.40, DATE '2024-01-29');
INSERT INTO Claims VALUES ('c015', 'a015', 'ip015', 'Pending', 360.20, DATE '2024-01-30');
INSERT INTO Claims VALUES ('c016', 'a016', 'ip001', 'Under Review', 2560.00, DATE '2024-01-31');
INSERT INTO Claims VALUES ('c017', 'a017', 'ip002', 'Approved', 640.60, DATE '2024-02-01');
INSERT INTO Claims VALUES ('c018', 'a018', 'ip003', 'Pending', 220.00, DATE '2024-02-02');
INSERT INTO Claims VALUES ('c019', 'a019', 'ip004', 'Under Review', 3600.00, DATE '2024-02-03');
INSERT INTO Claims VALUES ('c020', 'a020', 'ip005', 'Approved', 144.40, DATE '2024-02-04');

-- Evening and Night Shift Appointments
INSERT INTO Appointments VALUES ('a026', 'p021', 'doc006', DATE '2024-02-09', '06:00 PM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a027', 'p022', 'doc007', DATE '2024-02-10', '07:00 PM', 'Emergency', 'Scheduled');
INSERT INTO Appointments VALUES ('a028', 'p023', 'doc008', DATE '2024-02-11', '08:00 PM', 'Follow-up', 'Scheduled');
INSERT INTO Appointments VALUES ('a029', 'p024', 'doc009', DATE '2024-02-12', '09:00 PM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a030', 'p025', 'doc010', DATE '2024-02-13', '10:00 PM', 'Treatment', 'Scheduled');

-- Weekend Appointments
INSERT INTO Appointments VALUES ('a031', 'p011', 'doc011', DATE '2024-02-10', '10:00 AM', 'Follow-up', 'Scheduled');
INSERT INTO Appointments VALUES ('a032', 'p012', 'doc012', DATE '2024-02-11', '11:00 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a033', 'p013', 'doc013', DATE '2024-02-17', '02:00 PM', 'Treatment', 'Scheduled');
INSERT INTO Appointments VALUES ('a034', 'p014', 'doc014', DATE '2024-02-18', '03:00 PM', 'Screening', 'Scheduled');
INSERT INTO Appointments VALUES ('a035', 'p015', 'doc015', DATE '2024-02-24', '04:00 PM', 'Follow-up', 'Scheduled');

-- Additional Core Hospital Data
-- Users, Doctors, Patients, Appointments, and Prescriptions

-- Additional Doctor Users
INSERT INTO Users VALUES ('u046', 'Dr. Zahidul Islam', 'zahidul.islam@hospital.com', 'password123', '+8801710000046', DATE '2023-08-05', 'doctor');
INSERT INTO Users VALUES ('u047', 'Dr. Khadiza Rahman', 'khadiza.rahman@hospital.com', 'password123', '+8801710000047', DATE '2023-08-10', 'doctor');
INSERT INTO Users VALUES ('u048', 'Dr. Mahbubur Rahman', 'mahbubur.rahman@hospital.com', 'password123', '+8801710000048', DATE '2023-08-15', 'doctor');
INSERT INTO Users VALUES ('u049', 'Dr. Nasir Uddin', 'nasir.uddin@hospital.com', 'password123', '+8801710000049', DATE '2023-08-20', 'doctor');
INSERT INTO Users VALUES ('u050', 'Dr. Shahana Begum', 'shahana.begum@hospital.com', 'password123', '+8801710000050', DATE '2023-08-25', 'doctor');
INSERT INTO Users VALUES ('u051', 'Dr. Aminul Haque', 'aminul.haque@hospital.com', 'password123', '+8801710000051', DATE '2023-09-01', 'doctor');
INSERT INTO Users VALUES ('u052', 'Dr. Roksana Parvin', 'roksana.parvin@hospital.com', 'password123', '+8801710000052', DATE '2023-09-05', 'doctor');
INSERT INTO Users VALUES ('u053', 'Dr. Shamsul Alam', 'shamsul.alam@hospital.com', 'password123', '+8801710000053', DATE '2023-09-10', 'doctor');
INSERT INTO Users VALUES ('u054', 'Dr. Farhana Yasmin', 'farhana.yasmin@hospital.com', 'password123', '+8801710000054', DATE '2023-09-15', 'doctor');
INSERT INTO Users VALUES ('u055', 'Dr. Kamal Hossain', 'kamal.hossain@hospital.com', 'password123', '+8801710000055', DATE '2023-09-20', 'doctor');
INSERT INTO Users VALUES ('u056', 'Dr. Taslima Begum', 'taslima.begum@hospital.com', 'password123', '+8801710000056', DATE '2023-09-25', 'doctor');
INSERT INTO Users VALUES ('u057', 'Dr. Jamal Uddin', 'jamal.uddin@hospital.com', 'password123', '+8801710000057', DATE '2023-10-01', 'doctor');
INSERT INTO Users VALUES ('u058', 'Dr. Marium Akter', 'marium.akter@hospital.com', 'password123', '+8801710000058', DATE '2023-10-05', 'doctor');
INSERT INTO Users VALUES ('u059', 'Dr. Fazlul Karim', 'fazlul.karim@hospital.com', 'password123', '+8801710000059', DATE '2023-10-10', 'doctor');
INSERT INTO Users VALUES ('u060', 'Dr. Rehana Sultana', 'rehana.sultana@hospital.com', 'password123', '+8801710000060', DATE '2023-10-15', 'doctor');

-- Additional Patient Users
INSERT INTO Users VALUES ('u061', 'Rahima Khatun', 'rahima.khatun@mail.com', 'password123', '+8801710000061', DATE '2023-03-01', 'patient');
INSERT INTO Users VALUES ('u062', 'Abul Kalam', 'abul.kalam@mail.com', 'password123', '+8801710000062', DATE '2023-03-03', 'patient');
INSERT INTO Users VALUES ('u063', 'Morzina Begum', 'morzina.begum@mail.com', 'password123', '+8801710000063', DATE '2023-03-05', 'patient');
INSERT INTO Users VALUES ('u064', 'Sultan Ahmed', 'sultan.ahmed@mail.com', 'password123', '+8801710000064', DATE '2023-03-07', 'patient');
INSERT INTO Users VALUES ('u065', 'Kohinoor Begum', 'kohinoor.begum@mail.com', 'password123', '+8801710000065', DATE '2023-03-09', 'patient');
INSERT INTO Users VALUES ('u066', 'Rafique Uddin', 'rafique.uddin@mail.com', 'password123', '+8801710000066', DATE '2023-03-11', 'patient');
INSERT INTO Users VALUES ('u067', 'Nasreen Begum', 'nasreen.begum@mail.com', 'password123', '+8801710000067', DATE '2023-03-13', 'patient');
INSERT INTO Users VALUES ('u068', 'Mizanur Rahman', 'mizanur.rahman.patient@mail.com', 'password123', '+8801710000068', DATE '2023-03-15', 'patient');
INSERT INTO Users VALUES ('u069', 'Kamrun Nahar', 'kamrun.nahar@mail.com', 'password123', '+8801710000069', DATE '2023-03-17', 'patient');
INSERT INTO Users VALUES ('u070', 'Shahjahan Ali', 'shahjahan.ali@mail.com', 'password123', '+8801710000070', DATE '2023-03-19', 'patient');
INSERT INTO Users VALUES ('u071', 'Maksuda Begum', 'maksuda.begum@mail.com', 'password123', '+8801710000071', DATE '2023-03-21', 'patient');
INSERT INTO Users VALUES ('u072', 'Delwar Hossain', 'delwar.hossain@mail.com', 'password123', '+8801710000072', DATE '2023-03-23', 'patient');
INSERT INTO Users VALUES ('u073', 'Ruma Khatun', 'ruma.khatun@mail.com', 'password123', '+8801710000073', DATE '2023-03-25', 'patient');
INSERT INTO Users VALUES ('u074', 'Azizul Haque', 'azizul.haque@mail.com', 'password123', '+8801710000074', DATE '2023-03-27', 'patient');
INSERT INTO Users VALUES ('u075', 'Shahida Khatun', 'shahida.khatun@mail.com', 'password123', '+8801710000075', DATE '2023-03-29', 'patient');
INSERT INTO Users VALUES ('u076', 'Hafizur Rahman', 'hafizur.rahman@mail.com', 'password123', '+8801710000076', DATE '2023-03-31', 'patient');
INSERT INTO Users VALUES ('u077', 'Rashida Akter', 'rashida.akter@mail.com', 'password123', '+8801710000077', DATE '2023-04-02', 'patient');
INSERT INTO Users VALUES ('u078', 'Md. Alamgir', 'md.alamgir@mail.com', 'password123', '+8801710000078', DATE '2023-04-04', 'patient');
INSERT INTO Users VALUES ('u079', 'Parvin Akter', 'parvin.akter@mail.com', 'password123', '+8801710000079', DATE '2023-04-06', 'patient');
INSERT INTO Users VALUES ('u080', 'Nurul Islam', 'nurul.islam@mail.com', 'password123', '+8801710000080', DATE '2023-04-08', 'patient');
INSERT INTO Users VALUES ('u081', 'Marium Begum', 'marium.begum@mail.com', 'password123', '+8801710000081', DATE '2023-04-10', 'patient');
INSERT INTO Users VALUES ('u082', 'Razzaque Ahmed', 'razzaque.ahmed@mail.com', 'password123', '+8801710000082', DATE '2023-04-12', 'patient');
INSERT INTO Users VALUES ('u083', 'Fahima Khatun', 'fahima.khatun@mail.com', 'password123', '+8801710000083', DATE '2023-04-14', 'patient');
INSERT INTO Users VALUES ('u084', 'Abdur Rahman', 'abdur.rahman@mail.com', 'password123', '+8801710000084', DATE '2023-04-16', 'patient');
INSERT INTO Users VALUES ('u085', 'Nazma Begum', 'nazma.begum@mail.com', 'password123', '+8801710000085', DATE '2023-04-18', 'patient');
INSERT INTO Users VALUES ('u086', 'Saiful Islam', 'saiful.islam@mail.com', 'password123', '+8801710000086', DATE '2023-04-20', 'patient');
INSERT INTO Users VALUES ('u087', 'Rowshan Ara', 'rowshan.ara@mail.com', 'password123', '+8801710000087', DATE '2023-04-22', 'patient');
INSERT INTO Users VALUES ('u088', 'Md. Jakir', 'md.jakir@mail.com', 'password123', '+8801710000088', DATE '2023-04-24', 'patient');
INSERT INTO Users VALUES ('u089', 'Salma Akter', 'salma.akter@mail.com', 'password123', '+8801710000089', DATE '2023-04-26', 'patient');
INSERT INTO Users VALUES ('u090', 'Golam Rabbani', 'golam.rabbani@mail.com', 'password123', '+8801710000090', DATE '2023-04-28', 'patient');

-- Additional Doctors
INSERT INTO Doctors VALUES ('doc021', 'u046', 'b001', 'MD12365', 14, '8:00 AM - 4:00 PM', 'd001', 'https://labaid.com.bd/files/images/1700984798.jpg');
INSERT INTO Doctors VALUES ('doc022', 'u047', 'b001', 'MD12366', 11, '9:00 AM - 5:00 PM', 'd002', 'https://labaid.com.bd/files/images/1689245863.jpg');
INSERT INTO Doctors VALUES ('doc023', 'u048', 'b002', 'MD12367', 18, '7:00 AM - 3:00 PM', 'd003', 'https://labaid.com.bd/files/images/1613038899.jpg');
INSERT INTO Doctors VALUES ('doc024', 'u049', 'b002', 'MD12368', 16, '10:00 AM - 6:00 PM', 'd004', 'https://labaid.com.bd/files/images/1613039348.jpg');
INSERT INTO Doctors VALUES ('doc025', 'u050', 'b003', 'MD12369', 13, '8:30 AM - 4:30 PM', 'd005', 'https://labaid.com.bd/files/images/1611552270.png');
INSERT INTO Doctors VALUES ('doc026', 'u051', 'b003', 'MD12370', 19, '9:30 AM - 5:30 PM', 'd006', 'https://labaid.com.bd/files/images/1579432305.jpg');
INSERT INTO Doctors VALUES ('doc027', 'u052', 'b004', 'MD12371', 15, '6:00 AM - 2:00 PM', 'd007', 'https://labaid.com.bd/files/images/1579936745.jpg');
INSERT INTO Doctors VALUES ('doc028', 'u053', 'b004', 'MD12372', 12, '11:00 AM - 7:00 PM', 'd008', 'https://labaid.com.bd/files/images/1613629718.jpg');
INSERT INTO Doctors VALUES ('doc029', 'u054', 'b005', 'MD12373', 17, '2:00 PM - 10:00 PM', 'd009', 'https://labaid.com.bd/files/images/1683452616.png');
INSERT INTO Doctors VALUES ('doc030', 'u055', 'b005', 'MD12374', 20, '8:00 AM - 4:00 PM', 'd010', 'https://labaid.com.bd/files/images/1700981661.jpg');
INSERT INTO Doctors VALUES ('doc031', 'u056', 'b006', 'MD12375', 22, '9:00 AM - 5:00 PM', 'd001', 'https://labaid.com.bd/files/images/1584266085.jpg');
INSERT INTO Doctors VALUES ('doc032', 'u057', 'b006', 'MD12376', 14, '10:00 AM - 6:00 PM', 'd002', 'https://labaid.com.bd/files/images/1579936911.jpg');
INSERT INTO Doctors VALUES ('doc033', 'u058', 'b007', 'MD12377', 16, '7:30 AM - 3:30 PM', 'd003', 'https://labaid.com.bd/files/images/1579689371.jpg');
INSERT INTO Doctors VALUES ('doc034', 'u059', 'b007', 'MD12378', 18, '8:30 AM - 4:30 PM', 'd004', 'https://labaid.com.bd/files/images/1579584937.jpg');
INSERT INTO Doctors VALUES ('doc035', 'u060', 'b008', 'MD12379', 21, '1:00 PM - 9:00 PM', 'd005', 'https://labaid.com.bd/files/images/1611554412.png');

-- Additional Patients
INSERT INTO Patients VALUES ('p026', 'u061', DATE '1983-11-15', 'Female', 'A+', '78 Farmgate, Dhaka', '+8801711000026');
INSERT INTO Patients VALUES ('p027', 'u062', DATE '1970-08-22', 'Male', 'B+', '90 Panthapath, Dhaha', '+8801711000027');
INSERT INTO Patients VALUES ('p028', 'u063', DATE '1988-05-03', 'Female', 'O-', '12 Kawran Bazar, Dhaka', '+8801711000028');
INSERT INTO Patients VALUES ('p029', 'u064', DATE '1995-02-17', 'Male', 'AB+', '34 Tejgaon I/A, Dhaka', '+8801711000029');
INSERT INTO Patients VALUES ('p030', 'u065', DATE '1976-09-08', 'Female', 'A-', '56 Mohakhali, Dhaka', '+8801711000030');
INSERT INTO Patients VALUES ('p031', 'u066', DATE '1982-06-25', 'Male', 'B-', '78 Banani, Dhaka', '+8801711000031');
INSERT INTO Patients VALUES ('p032', 'u067', DATE '1990-11-12', 'Female', 'O+', '90 Baridhara, Dhaka', '+8801711000032');
INSERT INTO Patients VALUES ('p033', 'u068', DATE '1985-04-30', 'Male', 'AB-', '12 Bashundhara, Dhaka', '+8801711000033');
INSERT INTO Patients VALUES ('p034', 'u069', DATE '1992-07-18', 'Female', 'A+', '34 Shyamoli, Dhaka', '+8801711000034');
INSERT INTO Patients VALUES ('p035', 'u070', DATE '1979-10-05', 'Male', 'B+', '56 Lalmatia, Dhaka', '+8801711000035');
INSERT INTO Patients VALUES ('p036', 'u071', DATE '1987-03-12', 'Female', 'O-', '78 Mohammadpur, Dhaka', '+8801711000036');
INSERT INTO Patients VALUES ('p037', 'u072', DATE '1994-08-28', 'Male', 'A-', '90 Green Road, Dhaka', '+8801711000037');
INSERT INTO Patients VALUES ('p038', 'u073', DATE '1981-12-03', 'Female', 'B+', '12 New Elephant Road, Dhaka', '+8801711000038');
INSERT INTO Patients VALUES ('p039', 'u074', DATE '1989-01-17', 'Male', 'AB+', '34 Hazaribagh, Dhaka', '+8801711000039');
INSERT INTO Patients VALUES ('p040', 'u075', DATE '1996-06-08', 'Female', 'O+', '56 Lalbagh, Dhaka', '+8801711000040');
INSERT INTO Patients VALUES ('p041', 'u076', DATE '1984-09-25', 'Male', 'A+', '78 Chawkbazar, Dhaka', '+8801711000041');
INSERT INTO Patients VALUES ('p042', 'u077', DATE '1991-04-12', 'Female', 'B-', '90 Islampur, Dhaka', '+8801711000042');
INSERT INTO Patients VALUES ('p043', 'u078', DATE '1978-11-30', 'Male', 'AB-', '12 Sadarghat, Dhaka', '+8801711000043');
INSERT INTO Patients VALUES ('p044', 'u079', DATE '1993-02-18', 'Female', 'O-', '34 Sutrapur, Dhaka', '+8801711000044');
INSERT INTO Patients VALUES ('p045', 'u080', DATE '1986-07-05', 'Male', 'A-', '56 Gandaria, Dhaka', '+8801711000045');
INSERT INTO Patients VALUES ('p046', 'u081', DATE '1990-10-22', 'Female', 'B+', '78 Kotwali, Dhaka', '+8801711000046');
INSERT INTO Patients VALUES ('p047', 'u082', DATE '1977-05-09', 'Male', 'AB+', '90 Gendaria, Dhaka', '+8801711000047');
INSERT INTO Patients VALUES ('p048', 'u083', DATE '1985-12-26', 'Female', 'O+', '12 Kamrangirchar, Dhaka', '+8801711000048');
INSERT INTO Patients VALUES ('p049', 'u084', DATE '1992-09-13', 'Male', 'A+', '34 Zinzira, Dhaka', '+8801711000049');
INSERT INTO Patients VALUES ('p050', 'u085', DATE '1980-01-31', 'Female', 'B-', '56 Shyampur, Dhaka', '+8801711000050');
INSERT INTO Patients VALUES ('p051', 'u086', DATE '1988-08-07', 'Male', 'AB-', '78 Postogola, Dhaka', '+8801711000051');
INSERT INTO Patients VALUES ('p052', 'u087', DATE '1995-03-24', 'Female', 'O-', '90 Dholaipar, Dhaka', '+8801711000052');
INSERT INTO Patients VALUES ('p053', 'u088', DATE '1983-10-11', 'Male', 'A-', '12 Rayerbagh, Dhaka', '+8801711000053');
INSERT INTO Patients VALUES ('p054', 'u089', DATE '1991-07-28', 'Female', 'B+', '34 Mugda, Dhaka', '+8801711000054');
INSERT INTO Patients VALUES ('p055', 'u090', DATE '1987-04-15', 'Male', 'AB+', '56 Sabujbagh, Dhaka', '+8801711000055');

-- Additional Appointments (February to March 2024)
INSERT INTO Appointments VALUES ('a036', 'p026', 'doc021', DATE '2024-02-14', '09:00 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a037', 'p027', 'doc022', DATE '2024-02-15', '10:00 AM', 'Follow-up', 'Scheduled');
INSERT INTO Appointments VALUES ('a038', 'p028', 'doc023', DATE '2024-02-16', '11:00 AM', 'Surgery', 'Scheduled');
INSERT INTO Appointments VALUES ('a039', 'p029', 'doc024', DATE '2024-02-17', '02:00 PM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a040', 'p030', 'doc025', DATE '2024-02-18', '03:00 PM', 'Screening', 'Scheduled');
INSERT INTO Appointments VALUES ('a041', 'p031', 'doc026', DATE '2024-02-19', '09:30 AM', 'Treatment', 'Completed');
INSERT INTO Appointments VALUES ('a042', 'p032', 'doc027', DATE '2024-02-20', '10:30 AM', 'Emergency', 'Completed');
INSERT INTO Appointments VALUES ('a043', 'p033', 'doc028', DATE '2024-02-21', '11:30 AM', 'Consultation', 'Completed');
INSERT INTO Appointments VALUES ('a044', 'p034', 'doc029', DATE '2024-02-22', '01:00 PM', 'Surgery', 'Completed');
INSERT INTO Appointments VALUES ('a045', 'p035', 'doc030', DATE '2024-02-23', '02:30 PM', 'Consultation', 'Completed');
INSERT INTO Appointments VALUES ('a046', 'p036', 'doc031', DATE '2024-02-24', '03:30 PM', 'Follow-up', 'Completed');
INSERT INTO Appointments VALUES ('a047', 'p037', 'doc032', DATE '2024-02-25', '04:00 PM', 'Treatment', 'Completed');
INSERT INTO Appointments VALUES ('a048', 'p038', 'doc033', DATE '2024-02-26', '08:00 AM', 'Consultation', 'Completed');
INSERT INTO Appointments VALUES ('a049', 'p039', 'doc034', DATE '2024-02-27', '09:00 AM', 'Screening', 'Completed');
INSERT INTO Appointments VALUES ('a050', 'p040', 'doc035', DATE '2024-02-28', '01:30 PM', 'Consultation', 'Completed');
INSERT INTO Appointments VALUES ('a051', 'p041', 'doc001', DATE '2024-03-01', '09:00 AM', 'Follow-up', 'Scheduled');
INSERT INTO Appointments VALUES ('a052', 'p042', 'doc002', DATE '2024-03-02', '10:00 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a053', 'p043', 'doc003', DATE '2024-03-03', '11:00 AM', 'Treatment', 'Scheduled');
INSERT INTO Appointments VALUES ('a054', 'p044', 'doc004', DATE '2024-03-04', '02:00 PM', 'Emergency', 'Scheduled');
INSERT INTO Appointments VALUES ('a055', 'p045', 'doc005', DATE '2024-03-05', '03:00 PM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a056', 'p046', 'doc006', DATE '2024-03-06', '09:30 AM', 'Surgery', 'Scheduled');
INSERT INTO Appointments VALUES ('a057', 'p047', 'doc007', DATE '2024-03-07', '10:30 AM', 'Follow-up', 'Scheduled');
INSERT INTO Appointments VALUES ('a058', 'p048', 'doc008', DATE '2024-03-08', '11:30 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a059', 'p049', 'doc009', DATE '2024-03-09', '01:00 PM', 'Treatment', 'Scheduled');
INSERT INTO Appointments VALUES ('a060', 'p050', 'doc010', DATE '2024-03-10', '02:30 PM', 'Screening', 'Scheduled');
INSERT INTO Appointments VALUES ('a061', 'p051', 'doc021', DATE '2024-03-11', '08:30 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a062', 'p052', 'doc022', DATE '2024-03-12', '09:30 AM', 'Follow-up', 'Scheduled');
INSERT INTO Appointments VALUES ('a063', 'p053', 'doc023', DATE '2024-03-13', '10:30 AM', 'Surgery', 'Scheduled');
INSERT INTO Appointments VALUES ('a064', 'p054', 'doc024', DATE '2024-03-14', '11:30 AM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a065', 'p055', 'doc025', DATE '2024-03-15', '12:30 PM', 'Treatment', 'Scheduled');
INSERT INTO Appointments VALUES ('a066', 'p026', 'doc026', DATE '2024-03-16', '01:30 PM', 'Follow-up', 'Scheduled');
INSERT INTO Appointments VALUES ('a067', 'p027', 'doc027', DATE '2024-03-17', '02:30 PM', 'Emergency', 'Scheduled');
INSERT INTO Appointments VALUES ('a068', 'p028', 'doc028', DATE '2024-03-18', '03:30 PM', 'Consultation', 'Scheduled');
INSERT INTO Appointments VALUES ('a069', 'p029', 'doc029', DATE '2024-03-19', '04:30 PM', 'Screening', 'Scheduled');
INSERT INTO Appointments VALUES ('a070', 'p030', 'doc030', DATE '2024-03-20', '05:00 PM', 'Treatment', 'Scheduled');

-- Additional Prescriptions (for completed appointments)
INSERT INTO Prescriptions VALUES ('pr021', 'a041', 'doc026', 'p031', 'Oncology follow-up. Continue chemotherapy. Monitor blood counts weekly.', DATE '2024-02-19');
INSERT INTO Prescriptions VALUES ('pr022', 'a042', 'doc027', 'p032', 'Emergency treatment completed. Pain management and wound care instructions.', DATE '2024-02-20');
INSERT INTO Prescriptions VALUES ('pr023', 'a043', 'doc028', 'p033', 'Gastric issues resolved. Continue acid reducers. Dietary modifications recommended.', DATE '2024-02-21');
INSERT INTO Prescriptions VALUES ('pr024', 'a044', 'doc029', 'p034', 'Post-surgical care. Antibiotics and pain management. Follow-up in 1 week.', DATE '2024-02-22');
INSERT INTO Prescriptions VALUES ('pr025', 'a045', 'doc030', 'p035', 'Kidney function stable. Continue current medications. Regular monitoring required.', DATE '2024-02-23');
INSERT INTO Prescriptions VALUES ('pr026', 'a046', 'doc031', 'p036', 'Cardiac follow-up satisfactory. Adjust blood pressure medication dosage.', DATE '2024-02-24');
INSERT INTO Prescriptions VALUES ('pr027', 'a047', 'doc032', 'p037', 'Neurological symptoms improved. Continue current treatment plan.', DATE '2024-02-25');
INSERT INTO Prescriptions VALUES ('pr028', 'a048', 'doc033', 'p038', 'Orthopedic consultation completed. Physical therapy recommended.', DATE '2024-02-26');
INSERT INTO Prescriptions VALUES ('pr029', 'a049', 'doc034', 'p039', 'Pediatric screening normal. Vitamin supplements prescribed.', DATE '2024-02-27');
INSERT INTO Prescriptions VALUES ('pr030', 'a050', 'doc035', 'p040', 'Dermatological condition improving. Continue topical treatment.', DATE '2024-02-28');
INSERT INTO Prescriptions VALUES ('pr031', 'a036', 'doc021', 'p026', 'Hypertension management. Take medication before breakfast daily.', DATE '2024-02-14');
INSERT INTO Prescriptions VALUES ('pr032', 'a037', 'doc022', 'p027', 'Neurological follow-up. Continue seizure medication as prescribed.', DATE '2024-02-15');
INSERT INTO Prescriptions VALUES ('pr033', 'a038', 'doc023', 'p028', 'Pre-operative instructions. Stop blood thinners 48 hours before surgery.', DATE '2024-02-16');
INSERT INTO Prescriptions VALUES ('pr034', 'a039', 'doc024', 'p029', 'Pediatric consultation. Growth monitoring and nutritional supplements.', DATE '2024-02-17');
INSERT INTO Prescriptions VALUES ('pr035', 'a040', 'doc025', 'p030', 'Skin cancer screening completed. Biopsy results pending.', DATE '2024-02-18');

INSERT INTO Doctor_Specializations VALUES ('ds026', 'doc021', 'sp001');
INSERT INTO Doctor_Specializations VALUES ('ds027', 'doc022', 'sp002');
INSERT INTO Doctor_Specializations VALUES ('ds028', 'doc023', 'sp003');
INSERT INTO Doctor_Specializations VALUES ('ds029', 'doc024', 'sp004');
INSERT INTO Doctor_Specializations VALUES ('ds030', 'doc025', 'sp005');
INSERT INTO Doctor_Specializations VALUES ('ds031', 'doc026', 'sp006');
INSERT INTO Doctor_Specializations VALUES ('ds032', 'doc027', 'sp007');
INSERT INTO Doctor_Specializations VALUES ('ds033', 'doc028', 'sp008');
INSERT INTO Doctor_Specializations VALUES ('ds034', 'doc029', 'sp009');
INSERT INTO Doctor_Specializations VALUES ('ds035', 'doc030', 'sp010');
INSERT INTO Doctor_Specializations VALUES ('ds036', 'doc031', 'sp011');
INSERT INTO Doctor_Specializations VALUES ('ds037', 'doc032', 'sp012');
INSERT INTO Doctor_Specializations VALUES ('ds038', 'doc033', 'sp013');
INSERT INTO Doctor_Specializations VALUES ('ds039', 'doc034', 'sp014');
INSERT INTO Doctor_Specializations VALUES ('ds040', 'doc035', 'sp015');

COMMIT;