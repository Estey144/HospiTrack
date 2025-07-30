
--  AUTO-GENERATE APPOINTMENT IDs
-- Functionality: Automatically generates unique GUID for new appointments when ID is not provided
CREATE OR REPLACE TRIGGER trg_auto_appointment_id
    BEFORE INSERT ON Appointments
    FOR EACH ROW
    WHEN (NEW.id IS NULL)
BEGIN
    :NEW.id := SYS_GUID();
END;
/

--  USER ACTIVITY AUDIT TRAIL
-- Functionality: Tracks all user operations (INSERT/UPDATE/DELETE) and logs them to Audit_Log table
CREATE OR REPLACE TRIGGER trg_user_activity_audit
    AFTER INSERT OR UPDATE OR DELETE ON Users
    FOR EACH ROW
DECLARE
    v_action VARCHAR2(10);
    v_user_id VARCHAR2(36);
    v_details VARCHAR2(400);
    v_audit_id VARCHAR2(50);
BEGIN
    -- Generate ID using timestamp (no sequence needed)
    v_audit_id := 'AUD_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);

    -- Determine action
    IF INSERTING THEN
        v_action := 'INSERT';
        v_user_id := :NEW.id;
        v_details := 'New user: ' || :NEW.name || ' (Role: ' || :NEW.role || ')';
    ELSIF UPDATING THEN
        v_action := 'UPDATE';
        v_user_id := :NEW.id;
        v_details := 'User updated: ' || :NEW.name;
    ELSIF DELETING THEN
        v_action := 'DELETE';
        v_user_id := :OLD.id;
        v_details := 'User deleted: ' || :OLD.name;
    END IF;

    -- Insert into Audit_Log
    INSERT INTO Audit_Log (
        id,
        action_by,
        action_type,
        table_name,
        timestamp,
        details
    ) VALUES (
                 v_audit_id,
                 v_user_id,
                 v_action,
                 'Users',
                 SYSDATE,
                 v_details
             );

EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Silent fail
END;
/

-- TRIGGER 3: APPOINTMENT LIFECYCLE TRACKING
-- Functionality: Monitors appointment creation, updates, and cancellations with detailed logging
CREATE OR REPLACE TRIGGER trg_appointment_lifecycle_audit
    AFTER INSERT OR UPDATE OR DELETE ON Appointments
    FOR EACH ROW
DECLARE
    v_action VARCHAR2(10);
    v_details VARCHAR2(400);
    v_audit_id VARCHAR2(50);
BEGIN
    -- Generate ID using timestamp
    v_audit_id := 'APT_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);

    IF INSERTING THEN
        v_action := 'CREATE';
        v_details := 'Appointment created for Patient: ' || :NEW.patient_id ||
                     ' with Doctor: ' || :NEW.doctor_id;
    ELSIF UPDATING THEN
        v_action := 'UPDATE';
        v_details := 'Appointment ' || :NEW.id || ' updated';
        IF :OLD.status != :NEW.status THEN
            v_details := v_details || ' (Status: ' || :NEW.status || ')';
        END IF;
    ELSIF DELETING THEN
        v_action := 'DELETE';
        v_details := 'Appointment cancelled: ' || :OLD.id;
    END IF;

    INSERT INTO Audit_Log (
        id,
        action_by,
        action_type,
        table_name,
        timestamp,
        details
    ) VALUES (
                 v_audit_id,
                 'SYSTEM',
                 v_action,
                 'Appointments',
                 SYSDATE,
                 v_details
             );

EXCEPTION
    WHEN OTHERS THEN
        NULL;
END;
/

-- TRIGGER 4: AUTOMATED BILLING SYSTEM
-- Functionality: Automatically creates bills when appointments are marked as 'completed'
CREATE OR REPLACE TRIGGER trg_automated_billing_system
    AFTER UPDATE ON Appointments
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
DECLARE
    v_bill_id VARCHAR2(50);
    v_bill_exists NUMBER;
    v_amount NUMBER := 150;
    v_audit_id VARCHAR2(50);
BEGIN
    -- Check if bill already exists
    SELECT COUNT(*) INTO v_bill_exists
    FROM Bills
    WHERE appointment_id = :NEW.id;

    IF v_bill_exists = 0 THEN
        -- Generate IDs using timestamp
        v_bill_id := 'BILL_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
        v_audit_id := 'BIL_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);

        -- Set amount based on type
        CASE :NEW.type
            WHEN 'emergency' THEN v_amount := 300;
            WHEN 'consultation' THEN v_amount := 150;
            WHEN 'follow-up' THEN v_amount := 100;
            ELSE v_amount := 150;
            END CASE;

        -- Create bill
        INSERT INTO Bills (
            id,
            patient_id,
            appointment_id,
            total_amount,
            status,
            issue_date
        ) VALUES (
                     v_bill_id,
                     :NEW.patient_id,
                     :NEW.id,
                     v_amount,
                     'pending',
                     SYSDATE
                 );

        -- Log bill creation
        INSERT INTO Audit_Log (
            id,
            action_by,
            action_type,
            table_name,
            timestamp,
            details
        ) VALUES (
                     v_audit_id,
                     'SYSTEM',
                     'AUTO_CREATE',
                     'Bills',
                     SYSDATE,
                     'Auto bill created: ' || v_bill_id || ' (₹' || v_amount || ')'
                 );
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        NULL;
END;
/

-- TRIGGER 5: APPOINTMENT VALIDATION ENGINE
-- Functionality: Validates appointment dates (prevents past/future limits) before insertion
CREATE OR REPLACE TRIGGER trg_appointment_validation_engine
    BEFORE INSERT ON Appointments
    FOR EACH ROW
DECLARE
    v_audit_id VARCHAR2(50);
BEGIN
    -- Only validate new appointments
    IF :NEW.appointment_date < (SYSDATE - 1) THEN
        RAISE_APPLICATION_ERROR(-20001,
                                'Cannot schedule appointments more than 1 day in the past');
    END IF;

    IF :NEW.appointment_date > (SYSDATE + 365) THEN
        RAISE_APPLICATION_ERROR(-20002,
                                'Cannot schedule appointments more than 1 year in advance');
    END IF;

    -- Log validation success
    v_audit_id := 'VAL_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);

    INSERT INTO Audit_Log (
        id,
        action_by,
        action_type,
        table_name,
        timestamp,
        details
    ) VALUES (
                 v_audit_id,
                 'SYSTEM',
                 'VALIDATE',
                 'Appointments',
                 SYSDATE,
                 'Appointment validation passed'
             );

EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE BETWEEN -20099 AND -20001 THEN
            RAISE;
        END IF;
        NULL;
END;
/



-- Check if triggers were created
SELECT trigger_name, status, trigger_type
FROM user_triggers
WHERE trigger_name LIKE 'TRG_%'
ORDER BY trigger_name;


-- TRIGGER 6: DOCTOR CREDENTIALING SYSTEM
-- Functionality: Tracks doctor registration, profile updates, and credential changes
CREATE OR REPLACE TRIGGER trg_doctor_credentialing_system
    AFTER INSERT OR UPDATE OR DELETE ON Doctors
    FOR EACH ROW
DECLARE
    v_action VARCHAR2(10);
    v_details VARCHAR2(400);
    v_audit_id VARCHAR2(50);
BEGIN
    v_audit_id := 'DOC_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    
    IF INSERTING THEN
        v_action := 'REGISTER';
        v_details := 'New doctor registered: License ' || :NEW.license_number || 
                    ', Experience: ' || :NEW.experience_years || ' years';
    ELSIF UPDATING THEN
        v_action := 'UPDATE';
        v_details := 'Doctor profile updated: ' || :NEW.id;
        IF :OLD.experience_years != :NEW.experience_years THEN
            v_details := v_details || ' (Experience: ' || :NEW.experience_years || ' years)';
        END IF;
    ELSIF DELETING THEN
        v_action := 'REMOVE';
        v_details := 'Doctor profile removed: ' || :OLD.id;
    END IF;
    
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', v_action, 'Doctors', SYSDATE, v_details
    );
    
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- TRIGGER 7: PATIENT SAFETY COMPLIANCE
-- Functionality: Validates patient data (age limits, blood type format) for safety compliance
CREATE OR REPLACE TRIGGER trg_patient_safety_compliance
    BEFORE INSERT OR UPDATE ON Patients
    FOR EACH ROW
DECLARE
    v_age NUMBER;
    v_audit_id VARCHAR2(50);
BEGIN
    -- Basic safety validations
    IF :NEW.dob IS NOT NULL THEN
        IF :NEW.dob > SYSDATE THEN
            RAISE_APPLICATION_ERROR(-20010, 'Date of birth cannot be in the future');
        END IF;
        
        v_age := FLOOR((SYSDATE - :NEW.dob) / 365.25);
        IF v_age > 120 THEN
            RAISE_APPLICATION_ERROR(-20011, 'Patient age seems unrealistic. Please verify.');
        END IF;
    END IF;
    
    -- Blood type validation
    IF :NEW.blood_type IS NOT NULL AND 
       :NEW.blood_type NOT IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') THEN
        RAISE_APPLICATION_ERROR(-20012, 'Invalid blood type format');
    END IF;
    
    -- Log validation success
    v_audit_id := 'PAT_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', 'VALIDATE', 'Patients', SYSDATE, 'Patient data validation passed'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE BETWEEN -20099 AND -20001 THEN
            RAISE;
        END IF;
        NULL;
END;
/

-- TRIGGER 8: FINANCIAL TRANSACTION MONITOR
-- Functionality: Tracks bill status changes and payment processing for financial auditing
CREATE OR REPLACE TRIGGER trg_financial_transaction_monitor
    AFTER UPDATE ON Bills
    FOR EACH ROW
    WHEN (NEW.status != OLD.status)
DECLARE
    v_audit_id VARCHAR2(50);
    v_details VARCHAR2(400);
BEGIN
    v_audit_id := 'FIN_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    
    v_details := 'Bill ' || :NEW.id || ' status changed from ' || :OLD.status || 
                ' to ' || :NEW.status || ' (Amount: ₹' || :NEW.total_amount || ')';
    
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', 'STATUS_CHANGE', 'Bills', SYSDATE, v_details
    );
    
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- TRIGGER 9: LABORATORY WORKFLOW TRACKER
-- Functionality: Monitors lab test orders and result updates for workflow management
CREATE OR REPLACE TRIGGER trg_laboratory_workflow_tracker
    AFTER INSERT OR UPDATE ON Lab_Tests
    FOR EACH ROW
DECLARE
    v_action VARCHAR2(10);
    v_audit_id VARCHAR2(50);
    v_details VARCHAR2(400);
BEGIN
    v_audit_id := 'LAB_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    
    IF INSERTING THEN
        v_action := 'ORDERED';
        v_details := 'Lab test ordered: ' || :NEW.test_type || ' for Patient: ' || :NEW.patient_id;
    ELSIF UPDATING THEN
        v_action := 'UPDATED';
        v_details := 'Lab test updated: ' || :NEW.test_type;
        IF :OLD.result IS NULL AND :NEW.result IS NOT NULL THEN
            v_details := v_details || ' - Results available';
        END IF;
    END IF;
    
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', v_action, 'Lab_Tests', SYSDATE, v_details
    );
    
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- TRIGGER 10: PRESCRIPTION MANAGEMENT SYSTEM
-- Functionality: Tracks prescription creation and modifications by doctors for patients
CREATE OR REPLACE TRIGGER trg_prescription_management_system
    AFTER INSERT OR UPDATE ON Prescriptions
    FOR EACH ROW
DECLARE
    v_action VARCHAR2(10);
    v_audit_id VARCHAR2(50);
    v_details VARCHAR2(400);
BEGIN
    v_audit_id := 'RX_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    
    IF INSERTING THEN
        v_action := 'CREATED';
        v_details := 'Prescription created by Doctor: ' || :NEW.doctor_id || 
                    ' for Patient: ' || :NEW.patient_id;
    ELSIF UPDATING THEN
        v_action := 'MODIFIED';
        v_details := 'Prescription modified: ' || :NEW.id;
    END IF;
    
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', v_action, 'Prescriptions', SYSDATE, v_details
    );
    
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- TRIGGER 11: EMERGENCY RESPONSE COORDINATOR
-- Functionality: Manages ambulance requests and tracks emergency response status updates
CREATE OR REPLACE TRIGGER trg_emergency_response_coordinator
    AFTER INSERT OR UPDATE ON Ambulance_Requests
    FOR EACH ROW
DECLARE
    v_action VARCHAR2(15);
    v_audit_id VARCHAR2(50);
    v_details VARCHAR2(400);
BEGIN
    v_audit_id := 'EMR_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    
    IF INSERTING THEN
        v_action := 'REQUESTED';
        v_details := 'Emergency ambulance requested by Patient: ' || :NEW.patient_id || 
                    ' from ' || :NEW.pickup_location;
    ELSIF UPDATING THEN
        v_action := 'STATUS_UPDATE';
        v_details := 'Ambulance request ' || :NEW.id || ' status: ' || :NEW.status;
        IF :OLD.status != :NEW.status THEN
            v_details := v_details || ' (Changed from ' || :OLD.status || ')';
        END IF;
    END IF;
    
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', v_action, 'Ambulance_Requests', SYSDATE, v_details
    );
    
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- TRIGGER 12: FACILITY RESOURCE MANAGER
-- Functionality: Manages room assignments and tracks facility resource allocation/release
CREATE OR REPLACE TRIGGER trg_facility_resource_manager
    AFTER INSERT OR UPDATE OR DELETE ON Room_Assignments
    FOR EACH ROW
DECLARE
    v_action VARCHAR2(15);
    v_audit_id VARCHAR2(50);
    v_details VARCHAR2(400);
BEGIN
    v_audit_id := 'FAC_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    
    IF INSERTING THEN
        v_action := 'ASSIGNED';
        v_details := 'Room assigned: ' || :NEW.room_id || ' to Patient: ' || :NEW.patient_id;
    ELSIF UPDATING THEN
        v_action := 'MODIFIED';
        v_details := 'Room assignment modified for Patient: ' || :NEW.patient_id;
        IF :OLD.status != :NEW.status THEN
            v_details := v_details || ' (Status: ' || :NEW.status || ')';
        END IF;
    ELSIF DELETING THEN
        v_action := 'RELEASED';
        v_details := 'Room released: ' || :OLD.room_id || ' from Patient: ' || :OLD.patient_id;
    END IF;
    
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', v_action, 'Room_Assignments', SYSDATE, v_details
    );
    
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- TRIGGER 13: PATIENT SATISFACTION TRACKER
-- Functionality: Records patient feedback submissions and satisfaction ratings for quality monitoring
CREATE OR REPLACE TRIGGER trg_patient_satisfaction_tracker
    AFTER INSERT ON Feedback
    FOR EACH ROW
DECLARE
    v_audit_id VARCHAR2(50);
    v_details VARCHAR2(400);
BEGIN
    v_audit_id := 'SAT_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    
    v_details := 'Patient satisfaction feedback submitted by Patient: ' || :NEW.patient_id || 
                ' for ' || :NEW.target_type || ' (Rating: ' || :NEW.rating || '/5)';
    
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', 'FEEDBACK', 'Feedback', SYSDATE, v_details
    );
    
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- TRIGGER 14: INSURANCE CLAIMS PROCESSOR
-- Functionality: Tracks insurance claim submissions and status updates for reimbursement processing
CREATE OR REPLACE TRIGGER trg_insurance_claims_processor
    AFTER INSERT OR UPDATE ON Claims
    FOR EACH ROW
DECLARE
    v_action VARCHAR2(15);
    v_audit_id VARCHAR2(50);
    v_details VARCHAR2(400);
BEGIN
    v_audit_id := 'INS_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    
    IF INSERTING THEN
        v_action := 'SUBMITTED';
        v_details := 'Insurance claim submitted: ₹' || :NEW.claim_amount || 
                    ' for Appointment: ' || :NEW.appointment_id;
    ELSIF UPDATING THEN
        v_action := 'STATUS_UPDATE';
        v_details := 'Claim ' || :NEW.id || ' status: ' || :NEW.claim_status;
        IF :OLD.claim_status != :NEW.claim_status THEN
            v_details := v_details || ' (Was: ' || :OLD.claim_status || ')';
        END IF;
    END IF;
    
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', v_action, 'Claims', SYSDATE, v_details
    );
    
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- TRIGGER 15: HUMAN RESOURCES MONITOR
-- Functionality: Tracks staff hiring, profile updates, and termination activities for HR management
CREATE OR REPLACE TRIGGER trg_human_resources_monitor
    AFTER INSERT OR UPDATE OR DELETE ON Staff
    FOR EACH ROW
DECLARE
    v_action VARCHAR2(10);
    v_audit_id VARCHAR2(50);
    v_details VARCHAR2(400);
BEGIN
    v_audit_id := 'HR_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') || '_' || DBMS_RANDOM.VALUE(1000,9999);
    
    IF INSERTING THEN
        v_action := 'HIRED';
        v_details := 'New staff member hired: ' || :NEW.designation || 
                    ' in Department: ' || :NEW.department_id;
    ELSIF UPDATING THEN
        v_action := 'UPDATED';
        v_details := 'Staff profile updated: ' || :NEW.id;
        IF :OLD.designation != :NEW.designation THEN
            v_details := v_details || ' (New role: ' || :NEW.designation || ')';
        END IF;
    ELSIF DELETING THEN
        v_action := 'TERMINATED';
        v_details := 'Staff member terminated: ' || :OLD.designation;
    END IF;
    
    INSERT INTO Audit_Log (
        id, action_by, action_type, table_name, timestamp, details
    ) VALUES (
        v_audit_id, 'SYSTEM', v_action, 'Staff', SYSDATE, v_details
    );
    
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/


-- Check all triggers created
SELECT trigger_name, status, trigger_type, triggering_event
FROM user_triggers 
WHERE trigger_name LIKE 'TRG_%'
ORDER BY trigger_name;

-- Count total triggers
SELECT COUNT(*) as TOTAL_TRIGGERS 
FROM user_triggers 
WHERE trigger_name LIKE 'TRG_%';





