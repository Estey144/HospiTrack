-- HospiTrack Database - Expanded Bangladesh Sample Data
-- Insert data in dependency order to avoid foreign key constraint violations

-- 1. Users (Expanded with 25 users)
INSERT ALL
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u001', 'Dr. Mohammad Abdul Karim', 'karim.doctor@gmail.com', 'hashedpass123', '01711234567', DATE '2024-01-15', 'DOCTOR')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u002', 'Dr. Fatema Khatun', 'fatema.doc@yahoo.com', 'hashedpass123', '01812345678', DATE '2024-01-20', 'DOCTOR')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u003', 'Dr. Rahim Uddin Ahmed', 'rahim.ahmed@gmail.com', 'hashedpass123', '01923456789', DATE '2024-02-01', 'DOCTOR')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u004', 'Sakib Hasan', 'sakib.patient@gmail.com', 'hashedpass123', '01534567890', DATE '2024-03-15', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u005', 'Rubina Akter', 'rubina.akter@gmail.com', 'hashedpass123', '01645678901', DATE '2024-03-20', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u006', 'Al-Amin Hosen', 'alamin.hosen@gmail.com', 'hashedpass123', '01756789012', DATE '2024-04-01', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u007', 'Nurul Islam', 'nurul.staff@gmail.com', 'hashedpass123', '01867890123', DATE '2024-01-10', 'STAFF')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u008', 'Shahida Begum', 'shahida.nurse@gmail.com', 'hashedpass123', '01978901234', DATE '2024-01-25', 'STAFF')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u009', 'Md. Rafiqul Islam', 'rafiq.admin@gmail.com', 'hashedpass123', '01589012345', DATE '2024-01-01', 'ADMIN')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u010', 'Salma Khatun', 'salma.patient@gmail.com', 'hashedpass123', '01690123456', DATE '2024-05-10', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u011', 'Dr. Nazmul Haque', 'nazmul.cardio@gmail.com', 'hashedpass123', '01701234567', DATE '2024-02-15', 'DOCTOR')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u012', 'Tania Ahmed', 'tania.patient@gmail.com', 'hashedpass123', '01812345679', DATE '2024-06-01', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u013', 'Dr. Mahmuda Sultana', 'mahmuda.gynec@gmail.com', 'hashedpass123', '01755667788', DATE '2024-01-30', 'DOCTOR')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u014', 'Dr. Ashikur Rahman', 'ashik.ortho@gmail.com', 'hashedpass123', '01666778899', DATE '2024-02-10', 'DOCTOR')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u015', 'Rashida Begum', 'rashida.patient@gmail.com', 'hashedpass123', '01577889900', DATE '2024-04-15', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u016', 'Karim Uddin', 'karim.patient@gmail.com', 'hashedpass123', '01688990011', DATE '2024-05-20', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u017', 'Nasreen Akter', 'nasreen.nurse@gmail.com', 'hashedpass123', '01799001122', DATE '2024-02-05', 'STAFF')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u018', 'Md. Aminul Islam', 'aminul.admin@gmail.com', 'hashedpass123', '01600112233', DATE '2024-01-20', 'ADMIN')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u019', 'Dr. Habibur Rahman', 'habib.pediatric@gmail.com', 'hashedpass123', '01711223344', DATE '2024-03-01', 'DOCTOR')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u020', 'Sultana Parvin', 'sultana.patient@gmail.com', 'hashedpass123', '01822334455', DATE '2024-06-10', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u021', 'Md. Belal Hossain', 'belal.patient@gmail.com', 'hashedpass123', '01933445566', DATE '2024-07-01', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u022', 'Dr. Shireen Akhter', 'shireen.derma@gmail.com', 'hashedpass123', '01644556677', DATE '2024-02-20', 'DOCTOR')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u023', 'Jahanara Begum', 'jahanara.patient@gmail.com', 'hashedpass123', '01755667788', DATE '2024-05-30', 'PATIENT')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u024', 'Md. Rashed Khan', 'rashed.staff@gmail.com', 'hashedpass123', '01866778899', DATE '2024-01-12', 'STAFF')
  INTO Users (id, name, email, password, phone, created_at, role) VALUES ('u025', 'Fatima Khatun', 'fatima.patient@gmail.com', 'hashedpass123', '01977889900', DATE '2024-06-15', 'PATIENT')
SELECT * FROM dual;

-- 2. Hospital_Branches (Expanded with 8 branches of Ibn Sina Hospital)
INSERT ALL
  INTO Hospital_Branches (id, name, address, established_date) VALUES ('hb001', 'Ibn Sina Hospital - Dhanmondi', '1/A, Dhanmondi R/A, Dhaka-1205', DATE '2015-01-01')
  INTO Hospital_Branches (id, name, address, established_date) VALUES ('hb002', 'Ibn Sina Hospital - Uttara', '45, Sector 7, Uttara, Dhaka-1230', DATE '2017-03-15')
  INTO Hospital_Branches (id, name, address, established_date) VALUES ('hb003', 'Ibn Sina Hospital - Chattogram', '123, Agrabad C/A, Chattogram-4100', DATE '2018-06-20')
  INTO Hospital_Branches (id, name, address, established_date) VALUES ('hb004', 'Ibn Sina Hospital - Sylhet', '78, Zindabazar, Sylhet-3100', DATE '2019-09-10')
  INTO Hospital_Branches (id, name, address, established_date) VALUES ('hb005', 'Ibn Sina Hospital - Mirpur', '56, Mirpur-10, Dhaka-1216', DATE '2020-02-25')
  INTO Hospital_Branches (id, name, address, established_date) VALUES ('hb006', 'Ibn Sina Hospital - Gulshan', '89, Gulshan-2, Dhaka-1212', DATE '2021-05-15')
  INTO Hospital_Branches (id, name, address, established_date) VALUES ('hb007', 'Ibn Sina Hospital - Khulna', '34, Sonadanga, Khulna-9100', DATE '2022-08-30')
  INTO Hospital_Branches (id, name, address, established_date) VALUES ('hb008', 'Ibn Sina Hospital - Rajshahi', '67, Shaheb Bazar, Rajshahi-6000', DATE '2023-01-20')
SELECT * FROM dual;

-- 3. Branch_Contacts (Expanded)
INSERT ALL
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc001', 'hb001', '02-9876543', 'PHONE')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc002', 'hb001', '02-9876544', 'FAX')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc003', 'hb001', '02-9876545', 'EMERGENCY')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc004', 'hb002', '02-8765432', 'PHONE')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc005', 'hb002', '02-8765433', 'FAX')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc006', 'hb003', '031-654321', 'PHONE')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc007', 'hb003', '031-654322', 'FAX')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc008', 'hb004', '0821-123456', 'PHONE')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc009', 'hb004', '0821-123457', 'FAX')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc010', 'hb005', '02-7654321', 'PHONE')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc011', 'hb005', '02-7654322', 'EMERGENCY')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc012', 'hb006', '02-6543210', 'PHONE')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc013', 'hb006', '02-6543211', 'FAX')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc014', 'hb007', '041-543210', 'PHONE')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc015', 'hb007', '041-543211', 'FAX')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc016', 'hb008', '0721-432109', 'PHONE')
  INTO Branch_Contacts (id, branch_id, contact_number, type) VALUES ('bc017', 'hb008', '0721-432110', 'FAX')
SELECT * FROM dual;

-- 4. Departments (Expanded)
INSERT ALL
  INTO Departments (id, name, description) VALUES ('dept001', 'Cardiology', 'Heart and cardiovascular system related treatments')
  INTO Departments (id, name, description) VALUES ('dept002', 'Neurology', 'Brain and nervous system disorders')
  INTO Departments (id, name, description) VALUES ('dept003', 'Orthopedics', 'Bone and joint related treatments')
  INTO Departments (id, name, description) VALUES ('dept004', 'Pediatrics', 'Child healthcare and treatments')
  INTO Departments (id, name, description) VALUES ('dept005', 'Gynecology', 'Womens health and reproductive system')
  INTO Departments (id, name, description) VALUES ('dept006', 'General Medicine', 'General medical consultations and treatments')
  INTO Departments (id, name, description) VALUES ('dept007', 'Emergency', 'Emergency medical services')
  INTO Departments (id, name, description) VALUES ('dept008', 'Dermatology', 'Skin and hair related treatments')
  INTO Departments (id, name, description) VALUES ('dept009', 'Psychiatry', 'Mental health and psychological treatments')
  INTO Departments (id, name, description) VALUES ('dept010', 'Radiology', 'Medical imaging and diagnostics')
  INTO Departments (id, name, description) VALUES ('dept011', 'Pathology', 'Laboratory tests and diagnostics')
  INTO Departments (id, name, description) VALUES ('dept012', 'Oncology', 'Cancer treatment and care')
  INTO Departments (id, name, description) VALUES ('dept013', 'Urology', 'Urinary system and male reproductive health')
  INTO Departments (id, name, description) VALUES ('dept014', 'Ophthalmology', 'Eye care and vision treatments')
  INTO Departments (id, name, description) VALUES ('dept015', 'ENT', 'Ear, Nose, and Throat treatments')
SELECT * FROM dual;

-- 5. Specializations (Expanded)
INSERT ALL
  INTO Specializations (id, name, description) VALUES ('spec001', 'Interventional Cardiology', 'Cardiac catheterization and angioplasty procedures')
  INTO Specializations (id, name, description) VALUES ('spec002', 'Pediatric Neurology', 'Neurological disorders in children')
  INTO Specializations (id, name, description) VALUES ('spec003', 'Orthopedic Surgery', 'Surgical treatment of bone and joint disorders')
  INTO Specializations (id, name, description) VALUES ('spec004', 'Neonatology', 'Medical care for newborn infants')
  INTO Specializations (id, name, description) VALUES ('spec005', 'Obstetrics', 'Pregnancy and childbirth care')
  INTO Specializations (id, name, description) VALUES ('spec006', 'Internal Medicine', 'Diagnosis and treatment of adult diseases')
  INTO Specializations (id, name, description) VALUES ('spec007', 'Emergency Medicine', 'Acute care and emergency treatments')
  INTO Specializations (id, name, description) VALUES ('spec008', 'Cosmetic Dermatology', 'Aesthetic skin treatments')
  INTO Specializations (id, name, description) VALUES ('spec009', 'Child Psychology', 'Mental health care for children')
  INTO Specializations (id, name, description) VALUES ('spec010', 'Interventional Radiology', 'Minimally invasive procedures using imaging')
  INTO Specializations (id, name, description) VALUES ('spec011', 'Clinical Pathology', 'Laboratory medicine and diagnostics')
  INTO Specializations (id, name, description) VALUES ('spec012', 'Medical Oncology', 'Cancer chemotherapy and treatment')
  INTO Specializations (id, name, description) VALUES ('spec013', 'Laparoscopic Surgery', 'Minimally invasive surgical procedures')
  INTO Specializations (id, name, description) VALUES ('spec014', 'Retinal Surgery', 'Surgical treatment of retinal disorders')
  INTO Specializations (id, name, description) VALUES ('spec015', 'Rhinoplasty', 'Nasal surgery and reconstruction')
SELECT * FROM dual;

-- 6. Doctors (Expanded with 12 doctors)
INSERT ALL
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc001', 'u001', 'hb001', 'BMA-12345', 15, '9:00-17:00', 'dept001')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc002', 'u002', 'hb001', 'BMA-12346', 12, '10:00-18:00', 'dept005')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc003', 'u003', 'hb003', 'BMA-12347', 8, '8:00-16:00', 'dept002')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc004', 'u011', 'hb004', 'BMA-12348', 10, '9:00-17:00', 'dept001')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc005', 'u013', 'hb002', 'BMA-12349', 18, '8:00-16:00', 'dept005')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc006', 'u014', 'hb005', 'BMA-12350', 14, '9:00-17:00', 'dept003')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc007', 'u019', 'hb006', 'BMA-12351', 9, '10:00-18:00', 'dept004')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc008', 'u022', 'hb007', 'BMA-12352', 11, '9:00-17:00', 'dept008')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc009', 'u001', 'hb008', 'BMA-12353', 15, '14:00-22:00', 'dept001')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc010', 'u002', 'hb003', 'BMA-12354', 12, '8:00-16:00', 'dept005')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc011', 'u003', 'hb001', 'BMA-12355', 8, '18:00-02:00', 'dept007')
  INTO Doctors (id, user_id, branch_id, license_number, experience_years, available_hours, department_id) VALUES ('doc012', 'u013', 'hb005', 'BMA-12356', 18, '14:00-22:00', 'dept005')
SELECT * FROM dual;

-- 7. Doctor_Specializations (Expanded)
INSERT ALL
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds001', 'doc001', 'spec001')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds002', 'doc002', 'spec005')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds003', 'doc003', 'spec002')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds004', 'doc004', 'spec001')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds005', 'doc005', 'spec005')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds006', 'doc006', 'spec003')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds007', 'doc007', 'spec004')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds008', 'doc008', 'spec008')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds009', 'doc009', 'spec001')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds010', 'doc010', 'spec005')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds011', 'doc011', 'spec007')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds012', 'doc012', 'spec005')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds013', 'doc001', 'spec006')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds014', 'doc003', 'spec009')
  INTO Doctor_Specializations (id, doctor_id, specialization_id) VALUES ('ds015', 'doc006', 'spec013')
SELECT * FROM dual;

-- 8. Patients (Expanded with 20 patients)
INSERT ALL
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat001', 'u004', DATE '1990-05-15', 'Male', 'B+', '25, Mirpur-1, Dhaka-1216', '01711223344')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat002', 'u005', DATE '1985-08-20', 'Female', 'O+', '12, Uttara Sector-7, Dhaka-1230', '01822334455')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat003', 'u006', DATE '1995-12-10', 'Male', 'A+', '78, Nasirabad, Chattogram-4200', '01933445566')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat004', 'u010', DATE '1992-03-25', 'Female', 'AB+', '34, Banani, Dhaka-1213', '01744556677')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat005', 'u012', DATE '1988-09-18', 'Female', 'O-', '56, Lalmatia, Dhaka-1207', '01855667788')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat006', 'u015', DATE '1980-11-30', 'Female', 'A-', '89, Wari, Dhaka-1203', '01766778899')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat007', 'u016', DATE '1993-07-22', 'Male', 'B-', '45, Kazipara, Dhaka-1216', '01877889900')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat008', 'u020', DATE '1987-04-14', 'Female', 'AB-', '67, Mohammadpur, Dhaka-1207', '01688990011')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat009', 'u021', DATE '1991-01-08', 'Male', 'O+', '23, Shantinagar, Dhaka-1217', '01799001122')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat010', 'u023', DATE '1986-06-12', 'Female', 'A+', '12, Elephant Road, Dhaka-1205', '01600112233')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat011', 'u025', DATE '1994-10-25', 'Female', 'B+', '78, New Market, Dhaka-1205', '01711223344')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat012', 'u004', DATE '1989-02-17', 'Male', 'O-', '34, Tejgaon, Dhaka-1208', '01822334455')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat013', 'u005', DATE '1992-12-03', 'Female', 'AB+', '56, Khilgaon, Dhaka-1219', '01933445566')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat014', 'u006', DATE '1984-09-28', 'Male', 'A-', '89, Ramna, Dhaka-1000', '01744556677')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat015', 'u010', DATE '1990-08-15', 'Female', 'B-', '45, Motijheel, Dhaka-1000', '01855667788')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat016', 'u012', DATE '1988-05-20', 'Female', 'O+', '67, Purana Paltan, Dhaka-1000', '01766778899')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat017', 'u015', DATE '1995-03-11', 'Female', 'A+', '23, Maghbazar, Dhaka-1217', '01877889900')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat018', 'u016', DATE '1983-11-07', 'Male', 'AB-', '12, Segunbagicha, Dhaka-1000', '01688990011')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat019', 'u020', DATE '1991-07-19', 'Female', 'B+', '78, Eskaton, Dhaka-1000', '01799001122')
  INTO Patients (id, user_id, dob, gender, blood_type, address, emergency_contact) VALUES ('pat020', 'u021', DATE '1987-04-23', 'Male', 'O-', '34, Malibagh, Dhaka-1219', '01600112233')
SELECT * FROM dual;

-- 9. Staff (Expanded with 15 staff members)
INSERT ALL
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff001', 'u007', 'dept006', 'Senior Nurse', 'hb001')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff002', 'u008', 'dept004', 'Head Nurse', 'hb001')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff003', 'u009', 'dept007', 'Administrator', 'hb001')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff004', 'u017', 'dept005', 'Nurse', 'hb002')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff005', 'u018', 'dept001', 'Administrator', 'hb002')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff006', 'u024', 'dept003', 'Physiotherapist', 'hb003')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff007', 'u007', 'dept002', 'Nurse', 'hb003')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff008', 'u008', 'dept008', 'Nurse', 'hb004')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff009', 'u009', 'dept007', 'Administrator', 'hb004')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff010', 'u017', 'dept001', 'Technician', 'hb005')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff011', 'u018', 'dept010', 'Radiologist', 'hb005')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff012', 'u024', 'dept011', 'Lab Technician', 'hb006')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff013', 'u007', 'dept012', 'Nurse', 'hb006')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff014', 'u008', 'dept013', 'Nurse', 'hb007')
  INTO Staff (id, user_id, department_id, designation, branch_id) VALUES ('staff015', 'u009', 'dept014', 'Administrator', 'hb007')
SELECT * FROM dual;

-- 10. Rooms (Expanded with 30 rooms)
INSERT ALL
  INTO Rooms (id, room_number, type, status) VALUES ('room001', '101', 'General Ward', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room002', '102', 'Private Cabin', 'Occupied')
  INTO Rooms (id, room_number, type, status) VALUES ('room003', '103', 'ICU', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room004', '104', 'Private Cabin', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room005', '105', 'General Ward', 'Maintenance')
  INTO Rooms (id, room_number, type, status) VALUES ('room006', '201', 'VIP Suite', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room007', '202', 'Private Cabin', 'Occupied')
  INTO Rooms (id, room_number, type, status) VALUES ('room008', '203', 'General Ward', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room009', '204', 'ICU', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room010', '205', 'Private Cabin', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room011', '301', 'VIP Suite', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room012', '302', 'Private Cabin', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room013', '303', 'General Ward', 'Occupied')
  INTO Rooms (id, room_number, type, status) VALUES ('room014', '304', 'ICU', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room015', '305', 'Private Cabin', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room016', '401', 'VIP Suite', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room017', '402', 'Private Cabin', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room018', '403', 'General Ward', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room019', '404', 'ICU', 'Maintenance')
  INTO Rooms (id, room_number, type, status) VALUES ('room020', '405', 'Private Cabin', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room021', '501', 'VIP Suite', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room022', '502', 'Private Cabin', 'Occupied')
  INTO Rooms (id, room_number, type, status) VALUES ('room023', '503', 'General Ward', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room024', '504', 'ICU', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room025', '505', 'Private Cabin', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room026', '601', 'VIP Suite', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room027', '602', 'Private Cabin', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room028', '603', 'General Ward', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room029', '604', 'ICU', 'Available')
  INTO Rooms (id, room_number, type, status) VALUES ('room030', '605', 'Private Cabin', 'Available')
SELECT * FROM dual;

-- 11. Appointments (Expanded with 25 appointments)
INSERT ALL
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app001', 'pat001', 'doc001', DATE '2024-07-15', '10:00-10:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app002', 'pat002', 'doc002', DATE '2024-07-16', '14:00-14:30', 'Follow-up', 'Completed')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app003', 'pat003', 'doc003', DATE '2024-07-17', '09:00-09:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app004', 'pat004', 'doc004', DATE '2024-07-18', '11:00-11:30', 'Emergency', 'Completed')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app005', 'pat005', 'doc001', DATE '2024-07-19', '15:00-15:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app006', 'pat006', 'doc005', DATE '2024-07-20', '10:00-10:30', 'Follow-up', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app007', 'pat007', 'doc006', DATE '2024-07-21', '11:00-11:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app008', 'pat008', 'doc007', DATE '2024-07-22', '14:00-14:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app009', 'pat009', 'doc008', DATE '2024-07-23', '09:00-09:30', 'Follow-up', 'Completed')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app010', 'pat010', 'doc009', DATE '2024-07-24', '16:00-16:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app011', 'pat011', 'doc010', DATE '2024-07-25', '10:00-10:30', 'Emergency', 'Completed')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app012', 'pat012', 'doc011', DATE '2024-07-26', '20:00-20:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app013', 'pat013', 'doc012', DATE '2024-07-27', '15:00-15:30', 'Follow-up', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app014', 'pat014', 'doc001', DATE '2024-07-28', '11:00-11:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app015', 'pat015', 'doc002', DATE '2024-07-29', '14:00-14:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app016', 'pat016', 'doc003', DATE '2024-07-30', '09:00-09:30', 'Follow-up', 'Completed')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app017', 'pat017', 'doc004', DATE '2024-07-31', '10:00-10:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app018', 'pat018', 'doc005', DATE '2024-08-01', '11:00-11:30', 'Emergency', 'Completed')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app019', 'pat019', 'doc006', DATE '2024-08-02', '15:00-15:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app020', 'pat020', 'doc007', DATE '2024-08-03', '16:00-16:30', 'Follow-up', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app021', 'pat001', 'doc008', DATE '2024-08-04', '10:00-10:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app022', 'pat002', 'doc009', DATE '2024-08-05', '17:00-17:30', 'Follow-up', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app023', 'pat003', 'doc010', DATE '2024-08-06', '09:00-09:30', 'Consultation', 'Scheduled')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app024', 'pat004', 'doc011', DATE '2024-08-07', '21:00-21:30', 'Emergency', 'Completed')
  INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) VALUES ('app025', 'pat005', 'doc012', DATE '2024-08-08', '16:00-16:30', 'Consultation', 'Scheduled')
SELECT * FROM dual;

-- 12. Cabin (Expanded)
INSERT ALL
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab001', 'doc001', 'room002', 'app001')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab002', 'doc002', 'room004', 'app002')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab003', 'doc003', 'room006', 'app003')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab004', 'doc004', 'room007', 'app004')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab005', 'doc005', 'room010', 'app006')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab006', 'doc006', 'room012', 'app007')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab007', 'doc007', 'room015', 'app008')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab008', 'doc008', 'room017', 'app009')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab009', 'doc009', 'room020', 'app010')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab010', 'doc010', 'room022', 'app011')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab011', 'doc011', 'room025', 'app012')
  INTO Cabin (id, doctor_id, room_id, appointment_id) VALUES ('cab012', 'doc012', 'room027', 'app013')
SELECT * FROM dual;

-- 13. Room_Assignments (Expanded)
INSERT ALL
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra001', 'room002', 'pat001', DATE '2024-07-15', DATE '2024-07-17', 'Active')
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra002', 'room004', 'pat002', DATE '2024-07-16', DATE '2024-07-16', 'Completed')
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra003', 'room006', 'pat004', DATE '2024-07-18', DATE '2024-07-20', 'Active')
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra004', 'room007', 'pat006', DATE '2024-07-20', DATE '2024-07-22', 'Active')
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra005', 'room010', 'pat008', DATE '2024-07-22', DATE '2024-07-24', 'Active')
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra006', 'room013', 'pat009', DATE '2024-07-23', DATE '2024-07-23', 'Completed')
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra007', 'room022', 'pat011', DATE '2024-07-25', DATE '2024-07-25', 'Completed')
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra008', 'room025', 'pat016', DATE '2024-07-30', DATE '2024-07-30', 'Completed')
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra009', 'room027', 'pat018', DATE '2024-08-01', DATE '2024-08-01', 'Completed')
  INTO Room_Assignments (id, room_id, patient_id, start_time, end_time, status) VALUES ('ra010', 'room030', 'pat020', DATE '2024-08-03', DATE '2024-08-05', 'Active')
SELECT * FROM dual;

-- 14. Prescriptions (Expanded)
INSERT ALL
  INTO Prescriptions (id, appointment_id, doctor_id, patient_id, notes, date_issued) 
    VALUES ('pres001', 'app002', 'doc002', 'pat002', 'Take medication after meals. Follow up in 2 weeks.', DATE '2024-07-16')
  INTO Prescriptions (id, appointment_id, doctor_id, patient_id, notes, date_issued) 
    VALUES ('pres002', 'app004', 'doc004', 'pat004', 'Complete rest for 3 days. Avoid heavy lifting.', DATE '2024-07-18')
  INTO Prescriptions (id, appointment_id, doctor_id, patient_id, notes, date_issued) 
    VALUES ('pres003', 'app009', 'doc008', 'pat009', 'Apply cream twice daily. Avoid sun exposure.', DATE '2024-07-23')
  INTO Prescriptions (id, appointment_id, doctor_id, patient_id, notes, date_issued) 
    VALUES ('pres004', 'app011', 'doc010', 'pat011', 'Take during pregnancy as prescribed. Regular checkups needed.', DATE '2024-07-25')
  INTO Prescriptions (id, appointment_id, doctor_id, patient_id, notes, date_issued) 
    VALUES ('pres005', 'app016', 'doc003', 'pat016', 'Neurological medication. Take with food.', DATE '2024-07-30')
  INTO Prescriptions (id, appointment_id, doctor_id, patient_id, notes, date_issued) 
    VALUES ('pres006', 'app018', 'doc005', 'pat018', 'Post-delivery care. Continue for 6 weeks.', DATE '2024-08-01')
  INTO Prescriptions (id, appointment_id, doctor_id, patient_id, notes, date_issued) 
    VALUES ('pres007', 'app024', 'doc011', 'pat004', 'Emergency medication. Take immediately if symptoms occur.', DATE '2024-08-07')
SELECT * FROM dual;

-- 15. Medications (Completed)
INSERT ALL
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med010', 'Ciprofloxacin', '500mg', '2 times daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med011', 'Azithromycin', '250mg', '1 time daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med012', 'Cetirizine', '10mg', '1 time daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med013', 'Montelukast', '10mg', '1 time daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med014', 'Ranitidine', '150mg', '2 times daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med015', 'Ibuprofen', '400mg', '3 times daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med016', 'Doxycycline', '100mg', '2 times daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med017', 'Metronidazole', '400mg', '3 times daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med018', 'Insulin', 'Varies', 'As prescribed')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med019', 'Salbutamol', '100mcg', 'As needed')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med020', 'Hydrocortisone', '5mg', '1 time daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med021', 'Levothyroxine', '50mcg', '1 time daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med022', 'Amlodipine', '5mg', '1 time daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med023', 'Prednisolone', '10mg', '1 time daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med024', 'Calcium Carbonate', '500mg', '2 times daily')
  INTO Medications (id, medicine_name, dosage, duration) VALUES ('med025', 'Vitamin D3', '1000 IU', '1 time daily')
SELECT * FROM dual;

-- Lab_Tests
INSERT ALL
  INTO Lab_Tests (id, patient_id, test_type, test_date, result, doctor_id, file_url) VALUES ('lab001', 'pat001', 'Blood Test', DATE '2024-07-01', 'Normal', 'doc001', 'https://files.lab.com/lab001.pdf')
  INTO Lab_Tests (id, patient_id, test_type, test_date, result, doctor_id, file_url) VALUES ('lab002', 'pat002', 'MRI Scan', DATE '2024-07-03', 'Abnormal', 'doc002', 'https://files.lab.com/lab002.pdf')
  INTO Lab_Tests (id, patient_id, test_type, test_date, result, doctor_id, file_url) VALUES ('lab003', 'pat003', 'X-Ray', DATE '2024-07-05', 'Normal', 'doc003', 'https://files.lab.com/lab003.pdf')
  INTO Lab_Tests (id, patient_id, test_type, test_date, result, doctor_id, file_url) VALUES ('lab004', 'pat004', 'Ultrasound', DATE '2024-07-07', 'Normal', 'doc004', 'https://files.lab.com/lab004.pdf')
SELECT * FROM dual;

-- Pres_Med
INSERT ALL
  INTO Pres_Med (id, prescription_id, medication_id) VALUES ('pm001', 'pres001', 'med010')
  INTO Pres_Med (id, prescription_id, medication_id) VALUES ('pm002', 'pres002', 'med013')
  INTO Pres_Med (id, prescription_id, medication_id) VALUES ('pm003', 'pres003', 'med020')
  INTO Pres_Med (id, prescription_id, medication_id) VALUES ('pm004', 'pres004', 'med015')
SELECT * FROM dual;

-- Bills
INSERT ALL
  INTO Bills (id, patient_id, appointment_id, total_amount, status, issue_date) VALUES ('bill001', 'pat001', 'app001', 5000.0, 'Paid', DATE '2024-07-15')
  INTO Bills (id, patient_id, appointment_id, total_amount, status, issue_date) VALUES ('bill002', 'pat002', 'app002', 3000.0, 'Pending', DATE '2024-07-16')
  INTO Bills (id, patient_id, appointment_id, total_amount, status, issue_date) VALUES ('bill003', 'pat003', 'app003', 4000.0, 'Paid', DATE '2024-07-17')
  INTO Bills (id, patient_id, appointment_id, total_amount, status, issue_date) VALUES ('bill004', 'pat004', 'app004', 3500.0, 'Pending', DATE '2024-07-18')
SELECT * FROM dual;

-- Bill_Items
INSERT ALL
  INTO Bill_Items (id, bill_id, description, amount) VALUES ('bi001', 'bill001', 'Consultation Fee', 2000.0)
  INTO Bill_Items (id, bill_id, description, amount) VALUES ('bi002', 'bill001', 'Blood Test', 3000.0)
  INTO Bill_Items (id, bill_id, description, amount) VALUES ('bi003', 'bill002', 'MRI Scan', 3000.0)
  INTO Bill_Items (id, bill_id, description, amount) VALUES ('bi004', 'bill003', 'X-Ray', 2500.0)
  INTO Bill_Items (id, bill_id, description, amount) VALUES ('bi005', 'bill004', 'Ultrasound', 3500.0)
SELECT * FROM dual;

-- Ambulances
INSERT ALL
  INTO Ambulances (id, vehicle_number, status, location, branch_id) VALUES ('amb001', 'DHK-00123', 'Available', 'Dhanmondi', 'hb001')
  INTO Ambulances (id, vehicle_number, status, location, branch_id) VALUES ('amb002', 'DHK-00456', 'On Duty', 'Uttara', 'hb002')
  INTO Ambulances (id, vehicle_number, status, location, branch_id) VALUES ('amb003', 'DHK-00789', 'Available', 'Mirpur', 'hb005')
  INTO Ambulances (id, vehicle_number, status, location, branch_id) VALUES ('amb004', 'DHK-00234', 'Maintenance', 'Gulshan', 'hb006')
SELECT * FROM dual;

-- Ambulance_Requests
INSERT ALL
  INTO Ambulance_Requests (id, patient_id, ambulance_id, request_time, pickup_location, drop_location, status) VALUES ('ar001', 'pat001', 'amb001', DATE '2024-07-14', '25, Mirpur-1, Dhaka', 'Ibn Sina Dhanmondi', 'Completed')
  INTO Ambulance_Requests (id, patient_id, ambulance_id, request_time, pickup_location, drop_location, status) VALUES ('ar002', 'pat002', 'amb002', DATE '2024-07-15', 'Uttara Sector-7', 'Ibn Sina Dhanmondi', 'Pending')
  INTO Ambulance_Requests (id, patient_id, ambulance_id, request_time, pickup_location, drop_location, status) VALUES ('ar003', 'pat003', 'amb003', DATE '2024-07-16', 'Mirpur-10', 'Ibn Sina Mirpur', 'Completed')
  INTO Ambulance_Requests (id, patient_id, ambulance_id, request_time, pickup_location, drop_location, status) VALUES ('ar004', 'pat004', 'amb004', DATE '2024-07-17', 'Gulshan-2', 'Ibn Sina Gulshan', 'Pending')
SELECT * FROM dual;

-- Device_Logs
INSERT ALL
  INTO Device_Logs (id, patient_id, device_type, reading_type, reading_value, timestamp) VALUES ('dev001', 'pat001', 'Heart Rate Monitor', 'BPM', '72', DATE '2024-07-15')
  INTO Device_Logs (id, patient_id, device_type, reading_type, reading_value, timestamp) VALUES ('dev002', 'pat002', 'BP Monitor', 'Blood Pressure', '120/80', DATE '2024-07-15')
  INTO Device_Logs (id, patient_id, device_type, reading_type, reading_value, timestamp) VALUES ('dev003', 'pat003', 'Glucose Monitor', 'mg/dL', '90', DATE '2024-07-16')
  INTO Device_Logs (id, patient_id, device_type, reading_type, reading_value, timestamp) VALUES ('dev004', 'pat004', 'Oximeter', 'SpO2', '98%', DATE '2024-07-16')
SELECT * FROM dual;

-- VideoSessions
INSERT ALL
  INTO VideoSessions (id, appointment_id, video_link, session_status) VALUES ('vid001', 'app001', 'https://video.com/session1', 'Completed')
  INTO VideoSessions (id, appointment_id, video_link, session_status) VALUES ('vid002', 'app002', 'https://video.com/session2', 'Scheduled')
  INTO VideoSessions (id, appointment_id, video_link, session_status) VALUES ('vid003', 'app003', 'https://video.com/session3', 'Scheduled')
  INTO VideoSessions (id, appointment_id, video_link, session_status) VALUES ('vid004', 'app004', 'https://video.com/session4', 'Completed')
SELECT * FROM dual;

-- ChatLogs
INSERT ALL
  INTO ChatLogs (id, appointment_id, sender_id, message, timestamp) VALUES ('chat001', 'app001', 'u004', 'Hello Doctor', DATE '2024-07-15')
  INTO ChatLogs (id, appointment_id, sender_id, message, timestamp) VALUES ('chat002', 'app001', 'u001', 'Hello, how can I help?', DATE '2024-07-15')
  INTO ChatLogs (id, appointment_id, sender_id, message, timestamp) VALUES ('chat003', 'app002', 'u002', 'I am feeling better.', DATE '2024-07-16')
  INTO ChatLogs (id, appointment_id, sender_id, message, timestamp) VALUES ('chat004', 'app003', 'u003', 'Need a follow-up appointment.', DATE '2024-07-17')
SELECT * FROM dual;

-- Symptom_Checker
INSERT ALL
  INTO Symptom_Checker (id, patient_id, symptoms, suggested_conditions, suggestion_date) VALUES ('sym001', 'pat001', 'Fever, Cough', 'Flu, Viral Fever', DATE '2024-07-14')
  INTO Symptom_Checker (id, patient_id, symptoms, suggested_conditions, suggestion_date) VALUES ('sym002', 'pat002', 'Headache', 'Migraine, Tension Headache', DATE '2024-07-14')
  INTO Symptom_Checker (id, patient_id, symptoms, suggested_conditions, suggestion_date) VALUES ('sym003', 'pat003', 'Back Pain', 'Muscle Strain', DATE '2024-07-15')
  INTO Symptom_Checker (id, patient_id, symptoms, suggested_conditions, suggestion_date) VALUES ('sym004', 'pat004', 'Stomach Ache', 'Gastritis', DATE '2024-07-16')
SELECT * FROM dual;

-- Feedback
INSERT ALL
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES ('fb001', 'pat001', 'DOCTOR', 'doc001', 5, 'Excellent consultation.', DATE '2024-07-16')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES ('fb002', 'pat002', 'SERVICE', 'hb001', 4, 'Good ambulance service.', DATE '2024-07-17')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES ('fb003', 'pat003', 'DOCTOR', 'doc002', 5, 'Very helpful.', DATE '2024-07-18')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES ('fb004', 'pat004', 'SERVICE', 'hb002', 3, 'Average experience.', DATE '2024-07-19')
SELECT * FROM dual;

-- Insurance_Providers
INSERT ALL
  INTO Insurance_Providers (id, name, contact_info) VALUES ('ip001', 'Delta Life Insurance', 'Hotline: 16312, Email: contact@delta.com')
  INTO Insurance_Providers (id, name, contact_info) VALUES ('ip002', 'Guardian Health', 'Hotline: 16234, Email: info@guardianhealth.com')
  INTO Insurance_Providers (id, name, contact_info) VALUES ('ip003', 'Arogya Insurance', 'Hotline: 16000, Email: support@arogya.com')
  INTO Insurance_Providers (id, name, contact_info) VALUES ('ip004', 'SafeHealth', 'Hotline: 16111, Email: contact@safehealth.com')
SELECT * FROM dual;

-- Patient_Insurance
INSERT ALL
  INTO Patient_Insurance (id, patient_id, provider_id, policy_number, coverage_details) VALUES ('pi001', 'pat001', 'ip001', 'DLI-123456', 'Coverage up to 80% of total bill')
  INTO Patient_Insurance (id, patient_id, provider_id, policy_number, coverage_details) VALUES ('pi002', 'pat002', 'ip002', 'GH-654321', 'Covers only outpatient services')
  INTO Patient_Insurance (id, patient_id, provider_id, policy_number, coverage_details) VALUES ('pi003', 'pat003', 'ip003', 'AR-789012', 'Full coverage with co-pay')
  INTO Patient_Insurance (id, patient_id, provider_id, policy_number, coverage_details) VALUES ('pi004', 'pat004', 'ip004', 'SH-345678', 'Covers emergency and inpatient care')
SELECT * FROM dual;

-- Claims
INSERT ALL
  INTO Claims (id, appointment_id, insurance_id, claim_status, claim_amount, submitted_on) VALUES ('cl001', 'app001', 'ip001', 'Approved', 4000.0, DATE '2024-07-16')
  INTO Claims (id, appointment_id, insurance_id, claim_status, claim_amount, submitted_on) VALUES ('cl002', 'app002', 'ip002', 'Pending', 2000.0, DATE '2024-07-17')
  INTO Claims (id, appointment_id, insurance_id, claim_status, claim_amount, submitted_on) VALUES ('cl003', 'app003', 'ip003', 'Approved', 3500.0, DATE '2024-07-18')
  INTO Claims (id, appointment_id, insurance_id, claim_status, claim_amount, submitted_on) VALUES ('cl004', 'app004', 'ip004', 'Rejected', 1500.0, DATE '2024-07-19')
SELECT * FROM dual;


-- more feedbacks
INSERT ALL
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f001', 'pat001', 'doctor', 'doc101', 5, 'The doctor was very attentive and helpful.', DATE '2025-07-01')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f002', 'pat002', 'hospital', 'branch001', 4, 'Clean facilities and friendly staff.', DATE '2025-07-02')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f003', 'pat003', 'doctor', 'doc105', 5, 'Got quick diagnosis and good treatment.', DATE '2025-07-03')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f004', 'pat004', 'hospital', 'branch002', 5, 'Really impressed with the emergency response.', DATE '2025-07-04')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f005', 'pat005', 'doctor', 'doc107', 4, 'Doctor explained everything clearly.', DATE '2025-07-05')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f006', 'pat006', 'hospital', 'branch003', 5, 'Very smooth admission and discharge process.', DATE '2025-07-06')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f007', 'pat007', 'doctor', 'doc108', 4, 'Professional and polite doctor. Recommended.', DATE '2025-07-07')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f008', 'pat008', 'hospital', 'branch004', 5, 'Hospital staff were very responsive.', DATE '2025-07-08')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f009', 'pat009', 'doctor', 'doc110', 5, 'Great experience, the doctor was knowledgeable.', DATE '2025-07-09')
  INTO Feedback (id, patient_id, target_type, target_id, rating, comments, date_submitted) VALUES 
    ('f010', 'pat010', 'hospital', 'branch005', 4, 'Good environment and quick service.', DATE '2025-07-10')
SELECT * FROM dual;
