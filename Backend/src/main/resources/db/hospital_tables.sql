-- Create all tables without foreign keys

CREATE TABLE Users (
                       id VARCHAR2(36) PRIMARY KEY,
                       name VARCHAR2(100),
                       email VARCHAR2(100) UNIQUE,
                       password VARCHAR2(100),
                       phone VARCHAR2(20),
                       created_at DATE,
                       role VARCHAR2(50)
);

CREATE TABLE Hospital_Branches (
                                   id VARCHAR2(36) PRIMARY KEY,
                                   name VARCHAR2(100),
                                   address VARCHAR2(255),
                                   established_date DATE
);

CREATE TABLE Branch_Contacts (
                                 id VARCHAR2(36) PRIMARY KEY,
                                 branch_id VARCHAR2(36),
                                 contact_number VARCHAR2(20),
                                 type VARCHAR2(20)
);

CREATE TABLE Departments (
                             id VARCHAR2(36) PRIMARY KEY,
                             name VARCHAR2(100),
                             description VARCHAR2(255)
);

CREATE TABLE Staff (
                       id VARCHAR2(36) PRIMARY KEY,
                       user_id VARCHAR2(36),
                       department_id VARCHAR2(36),
                       designation VARCHAR2(100),
                       branch_id VARCHAR2(36)
);

CREATE TABLE Doctors (
                         id VARCHAR2(36) PRIMARY KEY,
                         user_id VARCHAR2(36),
                         branch_id VARCHAR2(36),
                         license_number VARCHAR2(100),
                         experience_years INT,
                         available_hours VARCHAR2(100),
                         department_id VARCHAR2(36),
                         image_url VARCHAR2(255)
);

CREATE TABLE Patients (
                          id VARCHAR2(36) PRIMARY KEY,
                          user_id VARCHAR2(36),
                          dob DATE,
                          gender VARCHAR2(10),
                          blood_type VARCHAR2(10),
                          address VARCHAR2(255),
                          emergency_contact VARCHAR2(20)
);

CREATE TABLE Rooms (
                       id VARCHAR2(36) PRIMARY KEY,
                       room_number VARCHAR2(20),
                       type VARCHAR2(50),
                       status VARCHAR2(50)
);

CREATE TABLE Cabin (
                       id VARCHAR2(36) PRIMARY KEY,
                       doctor_id VARCHAR2(36),
                       room_id VARCHAR2(36),
                       appointment_id VARCHAR2(36)
);

CREATE TABLE Appointments (
                              id VARCHAR2(36) PRIMARY KEY,
                              patient_id VARCHAR2(36),
                              doctor_id VARCHAR2(36),
                              appointment_date DATE,
                              time_slot VARCHAR2(50),
                              type VARCHAR2(50),
                              status VARCHAR2(50)
);

CREATE TABLE Room_Assignments (
                                  id VARCHAR2(36) PRIMARY KEY,
                                  room_id VARCHAR2(36),
                                  patient_id VARCHAR2(36),
                                  start_time DATE,
                                  end_time DATE,
                                  status VARCHAR2(50)
);

CREATE TABLE Prescriptions (
                               id VARCHAR2(36) PRIMARY KEY,
                               appointment_id VARCHAR2(36),
                               doctor_id VARCHAR2(36),
                               patient_id VARCHAR2(36),
                               notes CLOB,
                               date_issued DATE
);

CREATE TABLE Medications (
                             id VARCHAR2(36) PRIMARY KEY,
                             medicine_name VARCHAR2(100),
                             dosage VARCHAR2(50),
                             duration VARCHAR2(50)
);

CREATE TABLE Pres_Med (
                          id VARCHAR2(36) PRIMARY KEY,
                          prescription_id VARCHAR2(36),
                          medication_id VARCHAR2(36)
);

CREATE TABLE Lab_Tests (
                           id VARCHAR2(36) PRIMARY KEY,
                           patient_id VARCHAR2(36),
                           test_type VARCHAR2(100),
                           test_date DATE,
                           result VARCHAR2(255),
                           doctor_id VARCHAR2(36),
                           file_url VARCHAR2(255)
);

CREATE TABLE Bills (
                       id VARCHAR2(36) PRIMARY KEY,
                       patient_id VARCHAR2(36),
                       appointment_id VARCHAR2(36),
                       total_amount FLOAT,
                       status VARCHAR2(50),
                       issue_date DATE
);

CREATE TABLE Bill_Items (
                            id VARCHAR2(36) PRIMARY KEY,
                            bill_id VARCHAR2(36),
                            description VARCHAR2(255),
                            amount FLOAT
);

CREATE TABLE Specializations (
                                 id VARCHAR2(36) PRIMARY KEY,
                                 name VARCHAR2(100),
                                 description VARCHAR2(255)
);

CREATE TABLE Doctor_Specializations (
                                        id VARCHAR2(36) PRIMARY KEY,
                                        doctor_id VARCHAR2(36),
                                        specialization_id VARCHAR2(36)
);

CREATE TABLE Audit_Log (
                           id VARCHAR2(36) PRIMARY KEY,
                           action_by VARCHAR2(36),
                           action_type VARCHAR2(50),
                           table_name VARCHAR2(50),
                           timestamp DATE,
                           details CLOB
);

CREATE TABLE Ambulances (
                            id VARCHAR2(36) PRIMARY KEY,
                            vehicle_number VARCHAR2(50),
                            status VARCHAR2(50),
                            location VARCHAR2(255),
                            branch_id VARCHAR2(36)
);

CREATE TABLE Ambulance_Requests (
                                    id VARCHAR2(36) PRIMARY KEY,
                                    patient_id VARCHAR2(36),
                                    ambulance_id VARCHAR2(36),
                                    request_time DATE,
                                    pickup_location VARCHAR2(255),
                                    drop_location VARCHAR2(255),
                                    status VARCHAR2(50)
);

CREATE TABLE Device_Logs (
                             id VARCHAR2(36) PRIMARY KEY,
                             patient_id VARCHAR2(36),
                             device_type VARCHAR2(100),
                             reading_type VARCHAR2(100),
                             reading_value VARCHAR2(100),
                             timestamp DATE
);

CREATE TABLE VideoSessions (
                               id VARCHAR2(36) PRIMARY KEY,
                               appointment_id VARCHAR2(36),
                               video_link VARCHAR2(255),
                               session_status VARCHAR2(50)
);

CREATE TABLE ChatLogs (
                          id VARCHAR2(36) PRIMARY KEY,
                          appointment_id VARCHAR2(36),
                          sender_id VARCHAR2(36),
                          message CLOB,
                          timestamp DATE
);

CREATE TABLE Symptom_Checker (
                                 id VARCHAR2(36) PRIMARY KEY,
                                 patient_id VARCHAR2(36),
                                 symptoms CLOB,
                                 suggested_conditions CLOB,
                                 suggestion_date DATE
);

CREATE TABLE Feedback (
                          id VARCHAR2(36) PRIMARY KEY,
                          patient_id VARCHAR2(36),
                          target_type VARCHAR2(50),
                          target_id VARCHAR2(36),
                          rating INT,
                          comments CLOB,
                          date_submitted DATE
);

CREATE TABLE Insurance_Providers (
                                     id VARCHAR2(36) PRIMARY KEY,
                                     name VARCHAR2(100),
                                     contact_info VARCHAR2(255)
);

CREATE TABLE Patient_Insurance (
                                   id VARCHAR2(36) PRIMARY KEY,
                                   patient_id VARCHAR2(36),
                                   provider_id VARCHAR2(36),
                                   policy_number VARCHAR2(100),
                                   coverage_details CLOB
);

CREATE TABLE Claims (
                        id VARCHAR2(36) PRIMARY KEY,
                        appointment_id VARCHAR2(36),
                        insurance_id VARCHAR2(36),
                        claim_status VARCHAR2(50),
                        claim_amount FLOAT,
                        submitted_on DATE
);
