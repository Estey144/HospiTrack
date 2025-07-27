package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Feedback;
import com.edigest.HospiTrack.service.FeedbackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/feedback")
    public ResponseEntity<String> submitFeedback(@RequestBody Feedback feedback) {
        try {
            feedbackService.submitFeedback(feedback);
            return ResponseEntity.ok("Feedback submitted successfully");
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to submit feedback: " + e.getMessage());
        }
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        try {
            List<Feedback> feedbackList = feedbackService.getAllFeedback();
            return ResponseEntity.ok(feedbackList);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
