-- Add foreign key constraints after tables exist

ALTER TABLE Branch_Contacts
  ADD CONSTRAINT fk_branchcontacts_branch FOREIGN KEY (branch_id) REFERENCES Hospital_Branches(id);

ALTER TABLE Staff
  ADD CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES Users(id);

ALTER TABLE Staff
  ADD CONSTRAINT fk_staff_department FOREIGN KEY (department_id) REFERENCES Departments(id);

ALTER TABLE Staff
  ADD CONSTRAINT fk_staff_branch FOREIGN KEY (branch_id) REFERENCES Hospital_Branches(id);

ALTER TABLE Doctors
  ADD CONSTRAINT fk_doctors_user FOREIGN KEY (user_id) REFERENCES Users(id);

ALTER TABLE Doctors
  ADD CONSTRAINT fk_doctors_branch FOREIGN KEY (branch_id) REFERENCES Hospital_Branches(id);

ALTER TABLE Doctors
  ADD CONSTRAINT fk_doctors_department FOREIGN KEY (department_id) REFERENCES Departments(id);

ALTER TABLE Patients
  ADD CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES Users(id);

ALTER TABLE Cabin
  ADD CONSTRAINT fk_cabin_doctor FOREIGN KEY (doctor_id) REFERENCES Doctors(id);

ALTER TABLE Cabin
  ADD CONSTRAINT fk_cabin_room FOREIGN KEY (room_id) REFERENCES Rooms(id);

ALTER TABLE Cabin
  ADD CONSTRAINT fk_cabin_appointment FOREIGN KEY (appointment_id) REFERENCES Appointments(id);

ALTER TABLE Appointments
  ADD CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE Appointments
  ADD CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES Doctors(id);

ALTER TABLE Room_Assignments
  ADD CONSTRAINT fk_roomassignments_room FOREIGN KEY (room_id) REFERENCES Rooms(id);

ALTER TABLE Room_Assignments
  ADD CONSTRAINT fk_roomassignments_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE Prescriptions
  ADD CONSTRAINT fk_prescriptions_appointment FOREIGN KEY (appointment_id) REFERENCES Appointments(id);

ALTER TABLE Prescriptions
  ADD CONSTRAINT fk_prescriptions_doctor FOREIGN KEY (doctor_id) REFERENCES Doctors(id);

ALTER TABLE Prescriptions
  ADD CONSTRAINT fk_prescriptions_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE Pres_Med
  ADD CONSTRAINT fk_pres_med_prescription FOREIGN KEY (prescription_id) REFERENCES Prescriptions(id);

ALTER TABLE Pres_Med
  ADD CONSTRAINT fk_pres_med_medication FOREIGN KEY (medication_id) REFERENCES Medications(id);

ALTER TABLE Lab_Tests
  ADD CONSTRAINT fk_labtests_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE Lab_Tests
  ADD CONSTRAINT fk_labtests_doctor FOREIGN KEY (doctor_id) REFERENCES Doctors(id);

ALTER TABLE Bills
  ADD CONSTRAINT fk_bills_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE Bills
  ADD CONSTRAINT fk_bills_appointment FOREIGN KEY (appointment_id) REFERENCES Appointments(id);

ALTER TABLE Bill_Items
  ADD CONSTRAINT fk_billitems_bill FOREIGN KEY (bill_id) REFERENCES Bills(id);

ALTER TABLE Doctor_Specializations
  ADD CONSTRAINT fk_doctorspecializations_doctor FOREIGN KEY (doctor_id) REFERENCES Doctors(id);

ALTER TABLE Doctor_Specializations
  ADD CONSTRAINT fk_doctorspecializations_specialization FOREIGN KEY (specialization_id) REFERENCES Specializations(id);

ALTER TABLE Audit_Log
  ADD CONSTRAINT fk_auditlog_actionby FOREIGN KEY (action_by) REFERENCES Users(id);

ALTER TABLE Ambulances
  ADD CONSTRAINT fk_ambulances_branch FOREIGN KEY (branch_id) REFERENCES Hospital_Branches(id);

ALTER TABLE Ambulance_Requests
  ADD CONSTRAINT fk_ambulancerequests_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE Ambulance_Requests
  ADD CONSTRAINT fk_ambulancerequests_ambulance FOREIGN KEY (ambulance_id) REFERENCES Ambulances(id);

ALTER TABLE Device_Logs
  ADD CONSTRAINT fk_devicelogs_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE VideoSessions
  ADD CONSTRAINT fk_videosessions_appointment FOREIGN KEY (appointment_id) REFERENCES Appointments(id);

ALTER TABLE ChatLogs
  ADD CONSTRAINT fk_chatlogs_appointment FOREIGN KEY (appointment_id) REFERENCES Appointments(id);

ALTER TABLE ChatLogs
  ADD CONSTRAINT fk_chatlogs_sender FOREIGN KEY (sender_id) REFERENCES Users(id);

ALTER TABLE Symptom_Checker
  ADD CONSTRAINT fk_symptomchecker_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE Feedback
  ADD CONSTRAINT fk_feedback_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE Patient_Insurance
  ADD CONSTRAINT fk_patientinsurance_patient FOREIGN KEY (patient_id) REFERENCES Patients(id);

ALTER TABLE Patient_Insurance
  ADD CONSTRAINT fk_patientinsurance_provider FOREIGN KEY (provider_id) REFERENCES Insurance_Providers(id);

ALTER TABLE Claims
  ADD CONSTRAINT fk_claims_appointment FOREIGN KEY (appointment_id) REFERENCES Appointments(id);

ALTER TABLE Claims
  ADD CONSTRAINT fk_claims_insurance FOREIGN KEY (insurance_id) REFERENCES Insurance_Providers(id);
