package com.edigest.HospiTrack.service;

import com.edigest.HospiTrack.entity.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private JdbcTemplate jdbc;

    //  RAW SQL: Insert new appointment
    public Appointment save(Appointment appointment) {
        String sql = "INSERT INTO Appointments (id, patient_id, doctor_id, appointment_date, time_slot, type, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)"; // <-- raw SQL uses "time_slot" as column name
        jdbc.update(sql,
                appointment.getId(),
                appointment.getPatientId(),
                appointment.getDoctorId(),
                appointment.getAppointmentDate() != null ? new Date(appointment.getAppointmentDate().getTime()) : null,
                appointment.getTimeSlot(),  // maps to time_slot column
                appointment.getType(),
                appointment.getStatus()
        );
        return appointment;
    }

    //  RAW SQL: Select all appointments with proper alias for time_slot
    public List<Appointment> getAll() {
        String sql = "SELECT id, patient_id, doctor_id, appointment_date, time_slot AS timeSlot, type, status FROM Appointments";
        return jdbc.query(sql, new BeanPropertyRowMapper<>(Appointment.class));
    }

    //  RAW SQL: Delete appointment by ID
    public void delete(String id) {
        String sql = "DELETE FROM Appointments WHERE id = ?";
        jdbc.update(sql, id);
    }
}
