package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.dto.DashboardStatsResponse;
import com.dsa.mistakelog.dto.MistakeTypeStat;
import com.dsa.mistakelog.dto.MistakesOverTimeStat;
import com.dsa.mistakelog.dto.TopicStat;
import com.dsa.mistakelog.service.MistakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final MistakeService mistakeService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(mistakeService.getDashboardStats());
    }

    @GetMapping("/mistakes-by-type")
    public ResponseEntity<List<MistakeTypeStat>> getMistakesByType() {
        return ResponseEntity.ok(mistakeService.getMistakesByType());
    }

    @GetMapping("/mistakes-over-time")
    public ResponseEntity<List<MistakesOverTimeStat>> getMistakesOverTime(
            @RequestParam(defaultValue = "14") int days) {
        return ResponseEntity.ok(mistakeService.getMistakesOverTime(days));
    }

    @GetMapping("/mistakes-by-topic")
    public ResponseEntity<List<TopicStat>> getMistakesByTopic() {
        return ResponseEntity.ok(mistakeService.getMistakesByTopic());
    }
}
