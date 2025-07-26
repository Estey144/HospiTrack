package com.edigest.HospiTrack.controller;

import com.edigest.HospiTrack.payload.BillDTO;
import com.edigest.HospiTrack.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping
    public List<BillDTO> getBills(@RequestParam("userId") String userId) {
        return billService.getBillsByUserId(userId);
    }
}
