package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Appointment;
import com.edigest.HospiTrack.entity.Department;
import com.edigest.HospiTrack.entity.Doctor;
import com.edigest.HospiTrack.entity.Users;
import com.edigest.HospiTrack.entity.Users;
import com.edigest.HospiTrack.service.AppointmentService;
import com.edigest.HospiTrack.service.DepartmentService;
import com.edigest.HospiTrack.service.DoctorService;
import com.edigest.HospiTrack.service.UsersService;
import com.edigest.HospiTrack.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
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
    private UsersService userService;  // To get doctor name

    @PostMapping
    public Appointment create(@RequestBody Appointment a) {
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

    @GetMapping("/patient/{patientId}")
    public List<Map<String, Object>> getAppointmentsByPatientId(@PathVariable String patientId) {
        List<Appointment> appointments = service.getByPatientId(patientId);
        List<Doctor> allDoctors = doctorService.getAllDoctors();
        List<Department> allDepartments = departmentService.getAll();
        List<Users> allUsers = userService.getAll();  // To get doctor name

        return appointments.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("date", a.getAppointmentDate());
            map.put("time", a.getTimeSlot());
            map.put("status", a.getStatus());

            Doctor doctor = allDoctors.stream()
                    .filter(d -> d.getId().equals(a.getDoctorId()))
                    .findFirst().orElse(null);

            if (doctor != null) {

                Users doctorUser = allUsers.stream()
                        .filter(u -> Long.valueOf(u.getId()).equals(doctor.getUserId()))
                        .findFirst().orElse(null);

                map.put("doctorName", doctorUser != null ? doctorUser.getName() : "Unknown Doctor");

                Department dept = allDepartments.stream()
                        .filter(dep -> dep.getId().equals(doctor.getDepartmentId()))
                        .findFirst().orElse(null);

                map.put("department", dept != null ? dept.getName() : "Unknown Department");
            } else {
                map.put("doctorName", "Unknown");
                map.put("department", "Unknown");
            }

            return map;
        }).collect(Collectors.toList());
    }
}
