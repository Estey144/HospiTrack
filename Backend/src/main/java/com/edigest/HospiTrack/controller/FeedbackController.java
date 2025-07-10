package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.entity.Feedback;
import com.edigest.HospiTrack.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public List<Feedback> getFeedback() {
        return feedbackService.getPositiveFeedback();
    }
}