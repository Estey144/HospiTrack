package com.edigest.HospiTrack.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.entity.Doctor;
import com.edigest.HospiTrack.service.DoctorService;

@RestController
@RequestMapping("/api")
public class DoctorController {

    @Autowired
    private DoctorService service;

    @Autowired
    private JdbcTemplate jdbc;

    @GetMapping("/doctors/raw")
    public List<Doctor> getAllRaw() {
        return service.getAllDoctors();
    }
    @GetMapping("/doctors/names")
    public List<Map<String, Object>> getDoctorsNames() {
        return service.getDoctorsForFeedback();
    }
    @GetMapping("/doctors")
    public List<Map<String, Object>> getAllDoctors() {
        return service.getAllDoctorsForFrontend();
    }

    @GetMapping("/doctors/{id}")
    public Doctor getById(@PathVariable String id) {
        return service.getDoctorById(id);
    }

    @PostMapping("/doctors")
    public Doctor create(@RequestBody Doctor doctor) {
        return service.saveDoctor(doctor);
    }

    @DeleteMapping("/doctors/{id}")
    public void delete(@PathVariable String id) {
        service.deleteDoctor(id);
    }

    // Doctor Dashboard Endpoints
    @GetMapping("/doctors/{doctorId}/appointments")
    public List<Map<String, Object>> getDoctorAppointments(@PathVariable String doctorId) {
        try {
            String sql = "SELECT a.id, a.appointment_date, a.time_slot, a.type, a.status, " +
                        "p.name AS patientName " +
                        "FROM Appointments a " +
                        "JOIN Patients pt ON a.patient_id = pt.id " +
                        "JOIN Users p ON pt.user_id = p.id " +
                        "WHERE a.doctor_id = ? " +
                        "ORDER BY a.appointment_date DESC";
            
            List<Map<String, Object>> appointments = jdbc.query(sql, ps -> ps.setString(1, doctorId), (rs, rowNum) -> {
                Map<String, Object> appointment = new HashMap<>();
                appointment.put("id", rs.getString("id"));
                appointment.put("appointmentDate", rs.getTimestamp("appointment_date"));
                appointment.put("timeSlot", rs.getString("time_slot"));
                appointment.put("type", rs.getString("type"));
                appointment.put("status", rs.getString("status"));
                appointment.put("patientName", rs.getString("patientName"));
                return appointment;
            });
            
            return appointments;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @GetMapping("/doctors/{doctorId}/patients")
    public List<Map<String, Object>> getDoctorPatients(@PathVariable String doctorId) {
        try {
            String sql = "SELECT DISTINCT p.id, u.name, p.dob, p.gender, p.blood_type, " +
                        "u.phone, p.address " +
                        "FROM Patients p " +
                        "JOIN Users u ON p.user_id = u.id " +
                        "JOIN Appointments a ON p.id = a.patient_id " +
                        "WHERE a.doctor_id = ? " +
                        "ORDER BY u.name";
            
            List<Map<String, Object>> patients = jdbc.query(sql, ps -> ps.setString(1, doctorId), (rs, rowNum) -> {
                Map<String, Object> patient = new HashMap<>();
                patient.put("id", rs.getString("id"));
                patient.put("name", rs.getString("name"));
                patient.put("dob", rs.getDate("dob"));
                patient.put("gender", rs.getString("gender"));
                patient.put("bloodType", rs.getString("blood_type"));
                patient.put("phone", rs.getString("phone"));
                patient.put("address", rs.getString("address"));
                return patient;
            });
            
            return patients;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @GetMapping("/doctors/{doctorId}/labreports")
    public List<Map<String, Object>> getDoctorLabReports(@PathVariable String doctorId) {
        try {
            String sql = "SELECT lt.id, u.name AS patientName, lt.test_type, lt.test_date, " +
                        "lt.result, lt.file_url " +
                        "FROM Lab_Tests lt " +
                        "JOIN Patients p ON lt.patient_id = p.id " +
                        "JOIN Users u ON p.user_id = u.id " +
                        "WHERE lt.doctor_id = ? " +
                        "ORDER BY lt.test_date DESC";
            
            List<Map<String, Object>> labReports = jdbc.query(sql, ps -> ps.setString(1, doctorId), (rs, rowNum) -> {
                Map<String, Object> report = new HashMap<>();
                report.put("id", rs.getString("id"));
                report.put("patientName", rs.getString("patientName"));
                report.put("testType", rs.getString("test_type"));
                report.put("testDate", rs.getDate("test_date"));
                report.put("result", rs.getString("result"));
                report.put("fileUrl", rs.getString("file_url"));
                return report;
            });
            
            return labReports;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @PutMapping("/doctors/{doctorId}/availablehours")
    public Map<String, String> updateAvailableHours(@PathVariable String doctorId, @RequestBody Map<String, String> request) {
        try {
            String availableHours = request.get("availableHours");
            String sql = "UPDATE Doctors SET available_hours = ? WHERE id = ?";
            
            int rowsUpdated = jdbc.update(sql, availableHours, doctorId);
            
            Map<String, String> response = new HashMap<>();
            if (rowsUpdated > 0) {
                response.put("status", "success");
                response.put("message", "Available hours updated successfully");
            } else {
                response.put("status", "error");
                response.put("message", "Doctor not found");
            }
            
            return response;
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to update available hours");
            return response;
        }
    }

    // Patient History endpoint for Doctor Dashboard
    @GetMapping("/patients/{patientId}/history")
    public Map<String, Object> getPatientHistory(@PathVariable String patientId) {
        Map<String, Object> history = new HashMap<>();
        
        try {
            // Get prescriptions
            String prescriptionSql = "SELECT p.id, p.notes, p.date_issued " +
                                   "FROM Prescriptions p " +
                                   "WHERE p.patient_id = ? " +
                                   "ORDER BY p.date_issued DESC";
            
            List<Map<String, Object>> prescriptions = jdbc.query(prescriptionSql, ps -> ps.setString(1, patientId), (rs, rowNum) -> {
                Map<String, Object> prescription = new HashMap<>();
                prescription.put("id", rs.getString("id"));
                prescription.put("notes", rs.getString("notes"));
                prescription.put("dateIssued", rs.getTimestamp("date_issued"));
                return prescription;
            });
            
            // Get lab tests
            String labTestSql = "SELECT lt.id, lt.test_type, lt.test_date, lt.result " +
                              "FROM Lab_Tests lt " +
                              "WHERE lt.patient_id = ? " +
                              "ORDER BY lt.test_date DESC";
            
            List<Map<String, Object>> labTests = jdbc.query(labTestSql, ps -> ps.setString(1, patientId), (rs, rowNum) -> {
                Map<String, Object> labTest = new HashMap<>();
                labTest.put("id", rs.getString("id"));
                labTest.put("testType", rs.getString("test_type"));
                labTest.put("testDate", rs.getDate("test_date"));
                labTest.put("result", rs.getString("result"));
                return labTest;
            });
            
            history.put("prescriptions", prescriptions);
            history.put("labTests", labTests);
            
        } catch (Exception e) {
            history.put("prescriptions", new ArrayList<>());
            history.put("labTests", new ArrayList<>());
        }
        
        return history;
    }

    // Lab Test creation endpoint for Doctor Dashboard
    @PostMapping("/labtests")
    public Map<String, String> createLabTest(@RequestBody Map<String, Object> request) {
        try {
            String labTestId = UUID.randomUUID().toString();
            String patientId = (String) request.get("patientId");
            String testType = (String) request.get("testType");
            String doctorId = (String) request.get("doctorId");
            
            String sql = "INSERT INTO Lab_Tests (id, patient_id, test_type, test_date, doctor_id, result) " +
                        "VALUES (?, ?, ?, SYSDATE, ?, 'Pending')";
            
            int rowsInserted = jdbc.update(sql, labTestId, patientId, testType, doctorId);
            
            Map<String, String> response = new HashMap<>();
            if (rowsInserted > 0) {
                response.put("status", "success");
                response.put("message", "Lab test created successfully");
                response.put("id", labTestId);
            } else {
                response.put("status", "error");
                response.put("message", "Failed to create lab test");
            }
            
            return response;
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to create lab test: " + e.getMessage());
            return response;
        }
    }

    // Get prescriptions for a specific doctor
    @GetMapping("/doctors/{doctorId}/prescriptions")
    public List<Map<String, Object>> getDoctorPrescriptions(@PathVariable String doctorId) {
        try {
            String sql = "SELECT p.id, p.appointment_id, p.notes, p.date_issued, " +
                        "u.name AS patientName, a.appointment_date " +
                        "FROM Prescriptions p " +
                        "JOIN Patients pt ON p.patient_id = pt.id " +
                        "JOIN Users u ON pt.user_id = u.id " +
                        "LEFT JOIN Appointments a ON p.appointment_id = a.id " +
                        "WHERE p.doctor_id = ? " +
                        "ORDER BY p.date_issued DESC";
            
            List<Map<String, Object>> prescriptions = jdbc.query(sql, ps -> ps.setString(1, doctorId), (rs, rowNum) -> {
                Map<String, Object> prescription = new HashMap<>();
                prescription.put("id", rs.getString("id"));
                prescription.put("appointmentId", rs.getString("appointment_id"));
                prescription.put("notes", rs.getString("notes"));
                prescription.put("dateIssued", rs.getTimestamp("date_issued"));
                prescription.put("patientName", rs.getString("patientName"));
                prescription.put("appointmentDate", rs.getTimestamp("appointment_date"));
                return prescription;
            });
            
            System.out.println("Found " + prescriptions.size() + " prescriptions for doctor: " + doctorId);
            return prescriptions;
        } catch (Exception e) {
            System.err.println("Error fetching prescriptions for doctor " + doctorId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Appointment approval endpoint for Doctor Dashboard
    @PutMapping("/appointments/{appointmentId}/approve")
    public Map<String, String> approveAppointment(@PathVariable String appointmentId) {
        try {
            String sql = "UPDATE Appointments SET status = 'confirmed' WHERE id = ?";
            
            int rowsUpdated = jdbc.update(sql, appointmentId);
            
            Map<String, String> response = new HashMap<>();
            if (rowsUpdated > 0) {
                response.put("status", "success");
                response.put("message", "Appointment approved successfully");
                response.put("appointmentId", appointmentId);
            } else {
                response.put("status", "error");
                response.put("message", "Appointment not found or already approved");
            }
            
            return response;
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to approve appointment: " + e.getMessage());
            return response;
        }
    }

}
