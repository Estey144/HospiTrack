package com.edigest.HospiTrack.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
public class ReportsController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public Map<String, Object> getReports() {
        Map<String, Object> reports = new HashMap<>();

        // Get monthly statistics for the last 12 months
        String monthsQuery = """
            SELECT TO_CHAR(ADD_MONTHS(SYSDATE, -LEVEL+1), 'Mon YYYY') as month
            FROM DUAL 
            CONNECT BY LEVEL <= 12
            ORDER BY ADD_MONTHS(SYSDATE, -LEVEL+1)
        """;
        
        List<String> months = jdbcTemplate.queryForList(monthsQuery, String.class);

        // Get patient registration counts by month
        String patientsQuery = """
            SELECT COUNT(*) as count,
                   TO_CHAR(u.created_at, 'Mon YYYY') as month
            FROM Users u
            WHERE u.role = 'patient' 
            AND u.created_at >= ADD_MONTHS(SYSDATE, -12)
            GROUP BY TO_CHAR(u.created_at, 'Mon YYYY'),
                     EXTRACT(YEAR FROM u.created_at),
                     EXTRACT(MONTH FROM u.created_at)
            ORDER BY EXTRACT(YEAR FROM u.created_at),
                     EXTRACT(MONTH FROM u.created_at)
        """;

        List<Map<String, Object>> patientStats = jdbcTemplate.queryForList(patientsQuery);

        // Get appointment counts by month
        String appointmentsQuery = """
            SELECT COUNT(*) as count,
                   TO_CHAR(a.appointment_date, 'Mon YYYY') as month
            FROM Appointments a
            WHERE a.appointment_date >= ADD_MONTHS(SYSDATE, -12)
            GROUP BY TO_CHAR(a.appointment_date, 'Mon YYYY'),
                     EXTRACT(YEAR FROM a.appointment_date),
                     EXTRACT(MONTH FROM a.appointment_date)
            ORDER BY EXTRACT(YEAR FROM a.appointment_date),
                     EXTRACT(MONTH FROM a.appointment_date)
        """;

        List<Map<String, Object>> appointmentStats = jdbcTemplate.queryForList(appointmentsQuery);

        // Process the data to ensure all months are represented
        int[] patientCounts = new int[12];
        int[] appointmentCounts = new int[12];

        // Fill patient counts
        for (Map<String, Object> stat : patientStats) {
            String month = (String) stat.get("month");
            Number count = (Number) stat.get("count");
            int index = months.indexOf(month);
            if (index >= 0) {
                patientCounts[index] = count.intValue();
            }
        }

        // Fill appointment counts
        for (Map<String, Object> stat : appointmentStats) {
            String month = (String) stat.get("month");
            Number count = (Number) stat.get("count");
            int index = months.indexOf(month);
            if (index >= 0) {
                appointmentCounts[index] = count.intValue();
            }
        }

        reports.put("months", months);
        reports.put("patients", patientCounts);
        reports.put("appointments", appointmentCounts);

        return reports;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummaryReports() {
        Map<String, Object> summary = new HashMap<>();

        // Total counts
        summary.put("totalPatients", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Users WHERE role = 'patient'", Integer.class));
        summary.put("totalDoctors", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Users WHERE role = 'doctor'", Integer.class));
        summary.put("totalAppointments", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Appointments", Integer.class));
        summary.put("totalAmbulanceRequests", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Ambulance_Requests", Integer.class));

        // Current month statistics
        summary.put("monthlyPatients", jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM Users WHERE role = 'patient' AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM SYSDATE) AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM SYSDATE)", 
            Integer.class));
        summary.put("monthlyAppointments", jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM Appointments WHERE EXTRACT(MONTH FROM appointment_date) = EXTRACT(MONTH FROM SYSDATE) AND EXTRACT(YEAR FROM appointment_date) = EXTRACT(YEAR FROM SYSDATE)", 
            Integer.class));

        return summary;
    }
}
