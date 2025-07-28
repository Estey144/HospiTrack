package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Appointment;
import com.edigest.HospiTrack.entity.Department;
import com.edigest.HospiTrack.entity.Doctor;
import com.edigest.HospiTrack.entity.Users;
import com.edigest.HospiTrack.payload.AmbulanceRequestDTO;
import com.edigest.HospiTrack.service.AppointmentService;
import com.edigest.HospiTrack.service.DepartmentService;
import com.edigest.HospiTrack.service.DoctorService;
import com.edigest.HospiTrack.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService service;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UsersService userService;

    @PostMapping
    public Appointment create(@RequestBody Appointment a) {
        System.out.println("Received appointment: " + a);
        return service.save(a);
    }

    @GetMapping
    public List<Appointment> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @GetMapping("/patient/{userId}")
    public List<Map<String, Object>> getAppointmentsByUserId(@PathVariable String userId) {
        // Get patientId from userId
        String patientId = service.getPatientIdByUserId(userId);
        if (patientId == null) {
            System.out.println("No patient found for user ID: " + userId);
            return List.of();
        }

        List<Appointment> appointments = service.getByPatientId(patientId);
        List<Doctor> allDoctors = doctorService.getAllDoctors();
        List<Department> allDepartments = departmentService.getAll();
        List<Users> allUsers = userService.getAll();

        if (appointments.isEmpty()) {
            System.out.println("No appointments found for patient ID: " + patientId);
            return List.of();
        }

        return appointments.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("appointmentDate", a.getAppointmentDate()); // renamed to match frontend
            map.put("appointmentTime", a.getTimeSlot());        // renamed to match frontend
            map.put("status", a.getStatus());

            Doctor doctor = allDoctors.stream()
                    .filter(d -> d.getId().equals(a.getDoctorId()))
                    .findFirst().orElse(null);

            if (doctor != null) {
                Users doctorUser = allUsers.stream()
                        .filter(u -> u.getId().equals(doctor.getUserId()))
                        .findFirst().orElse(null);

                map.put("doctorName", doctorUser != null ? doctorUser.getName() : "Unknown Doctor");

                Department dept = allDepartments.stream()
                        .filter(dep -> dep.getId().equals(doctor.getDepartmentId()))
                        .findFirst().orElse(null);

                map.put("specialty", dept != null ? dept.getName() : "Unknown Specialty"); // renamed to 'specialty' for frontend
            } else {
                map.put("doctorName", "Unknown");
                map.put("specialty", "Unknown Specialty");
            }

            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping("/patient/{patientId}")
    public List<AmbulanceRequestDTO> getAppointmentDetailsByPatientId(@PathVariable String patientId) {
        return service.getAppointmentDetailsByPatientId(patientId);
    }
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createAppointment(@PathVariable String userId, @RequestBody Appointment appointment) {
        System.out.println("Received appointment (with userId): " + appointment);

        // Get patientId from userId
        String patientId = service.getPatientIdByUserId(userId);
        if (patientId == null) {
            return ResponseEntity.badRequest().body("No patient found for user ID: " + userId);
        }

        // Set correct patientId before saving
        appointment.setPatientId(patientId);

        // Save the appointment
        Appointment saved = service.save(appointment);
        return ResponseEntity.ok(saved);
    }

}
