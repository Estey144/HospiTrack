package com.edigest.HospiTrack.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.payload.AmbulanceRequestDTO;
import com.edigest.HospiTrack.service.AmbulanceRequestService;

@RestController
@RequestMapping("/api/ambulance-requests")
public class AmbulanceRequestController {

    private final AmbulanceRequestService ambulanceRequestService;

    public AmbulanceRequestController(AmbulanceRequestService ambulanceRequestService) {
        this.ambulanceRequestService = ambulanceRequestService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllRequests() {
        return ResponseEntity.ok(ambulanceRequestService.getAllRequests());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getRequestsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(ambulanceRequestService.getRequestsByUserId(userId));
    }
    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody AmbulanceRequestDTO dto) {
        try {
            String requestId = ambulanceRequestService.createAmbulanceRequest(
                    dto.getUserId(),
                    dto.getPickupLocation(),
                    dto.getDropLocation(),
                    dto.getRequestedTime()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "requestId", requestId,
                    "message", "Ambulance request created successfully"
            ));
        } catch (RuntimeException e) {
            // If it's our known error (like no ambulance), return 503
            if (e.getMessage().contains("busy")) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("error", e.getMessage()));
            }

            // For all others, 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

}
