package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.config.CurrentUserResolver;
import com.dsa.mistakelog.dto.DashboardStatsResponse;
import com.dsa.mistakelog.dto.MistakeTypeStat;
import com.dsa.mistakelog.dto.MistakesOverTimeStat;
import com.dsa.mistakelog.dto.TopicStat;
import com.dsa.mistakelog.entity.User;
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
    private final CurrentUserResolver currentUserResolver;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        User currentUser = currentUserResolver.resolveCurrentUser();
        return ResponseEntity.ok(mistakeService.getDashboardStats(currentUser));
    }

    @GetMapping("/mistakes-by-type")
    public ResponseEntity<List<MistakeTypeStat>> getMistakesByType() {
        User currentUser = currentUserResolver.resolveCurrentUser();
        return ResponseEntity.ok(mistakeService.getMistakesByType(currentUser));
    }

    @GetMapping("/mistakes-over-time")
    public ResponseEntity<List<MistakesOverTimeStat>> getMistakesOverTime(
            @RequestParam(defaultValue = "14") int days) {
        User currentUser = currentUserResolver.resolveCurrentUser();
        return ResponseEntity.ok(mistakeService.getMistakesOverTime(currentUser, days));
    }

    @GetMapping("/mistakes-by-topic")
    public ResponseEntity<List<TopicStat>> getMistakesByTopic() {
        User currentUser = currentUserResolver.resolveCurrentUser();
        return ResponseEntity.ok(mistakeService.getMistakesByTopic(currentUser));
    }
}
