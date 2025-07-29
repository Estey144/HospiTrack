package com.edigest.HospiTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edigest.HospiTrack.payload.BillDTO;
import com.edigest.HospiTrack.service.BillService;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping
    public List<BillDTO> getBills(@RequestParam(value = "userId", required = false) String userId) {
        if (userId != null && !userId.isEmpty()) {
            return billService.getBillsByUserId(userId);
        } else {
            return billService.getAllBills();
        }
    }
}
