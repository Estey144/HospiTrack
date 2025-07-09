package com.edigest.HospiTrack.webconfig;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class TriggerCreator {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void createSequenceAndTriggers() {
        try {
            // Create USERS_SEQ (ignore error if already exists)
            try {
                jdbcTemplate.execute("CREATE SEQUENCE USERS_SEQ START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE");
            } catch (Exception ignored) {}

            // Create PATIENTS_SEQ (ignore error if already exists)
            try {
                jdbcTemplate.execute("CREATE SEQUENCE PATIENTS_SEQ START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE");
            } catch (Exception ignored) {}

            // Create USERS ID trigger
            jdbcTemplate.execute("""
            CREATE OR REPLACE TRIGGER trg_users_id
            BEFORE INSERT ON USERS
            FOR EACH ROW
            BEGIN
              IF :NEW.ID IS NULL THEN
                SELECT USERS_SEQ.NEXTVAL INTO :NEW.ID FROM dual;
              END IF;
            END;
            """);

            // Create USERS lowercase trigger
            jdbcTemplate.execute("""
            CREATE OR REPLACE TRIGGER trg_users_to_lowercase
            BEFORE INSERT OR UPDATE ON USERS
            FOR EACH ROW
            BEGIN
              IF :NEW.NAME IS NOT NULL THEN
                :NEW.NAME := LOWER(:NEW.NAME);
              END IF;

              IF :NEW.EMAIL IS NOT NULL THEN
                :NEW.EMAIL := LOWER(:NEW.EMAIL);
              END IF;

              IF :NEW.PHONE IS NOT NULL THEN
                :NEW.PHONE := LOWER(:NEW.PHONE);
              END IF;

              IF :NEW.ROLE IS NOT NULL THEN
                :NEW.ROLE := LOWER(:NEW.ROLE);
              END IF;
            END;
            """);

            // Create PATIENTS ID trigger
            jdbcTemplate.execute("""
            CREATE OR REPLACE TRIGGER trg_patients_id
            BEFORE INSERT ON PATIENTS
            FOR EACH ROW
            BEGIN
              IF :NEW.ID IS NULL THEN
                SELECT PATIENTS_SEQ.NEXTVAL INTO :NEW.ID FROM dual;
              END IF;
            END;
            """);

            System.out.println("Sequences and triggers for USERS and PATIENTS created successfully.");

        } catch (Exception e) {
            System.err.println("Error while creating sequences or triggers: " + e.getMessage());
        }
    }

}
