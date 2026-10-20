package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.config.CurrentUserResolver;
import com.dsa.mistakelog.dto.LearningProgressResponse;
import com.dsa.mistakelog.dto.RecordViewRequest;
import com.dsa.mistakelog.dto.ToggleProgressRequest;
import com.dsa.mistakelog.entity.User;
import com.dsa.mistakelog.service.LearningProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/learn/progress")
@RequiredArgsConstructor
public class LearningProgressController {

    private final LearningProgressService progressService;
    private final CurrentUserResolver currentUserResolver;

    @GetMapping
    public ResponseEntity<LearningProgressResponse> getUserProgress() {
        User currentUser = currentUserResolver.resolveCurrentUser();
        return ResponseEntity.ok(progressService.getUserProgress(currentUser));
    }

    @GetMapping("/{topicSlug}")
    public ResponseEntity<Map<String, Object>> getTopicProgress(@PathVariable String topicSlug) {
        User currentUser = currentUserResolver.resolveCurrentUser();
        return ResponseEntity.ok(progressService.getTopicProgress(currentUser, topicSlug));
    }

    @PostMapping("/toggle")
    public ResponseEntity<LearningProgressResponse> toggleProgress(@Valid @RequestBody ToggleProgressRequest request) {
        User currentUser = currentUserResolver.resolveCurrentUser();
        return ResponseEntity.ok(progressService.toggleProgress(currentUser, request));
    }

    @PutMapping("/points/{learningPointId}")
    public ResponseEntity<LearningProgressResponse> updatePointProgress(
            @PathVariable String learningPointId,
            @Valid @RequestBody ToggleProgressRequest request) {
        User currentUser = currentUserResolver.resolveCurrentUser();
        request.setLearningPointId(learningPointId);
        return ResponseEntity.ok(progressService.toggleProgress(currentUser, request));
    }

    @PostMapping("/view")
    public ResponseEntity<Void> recordLessonView(@Valid @RequestBody RecordViewRequest request) {
        User currentUser = currentUserResolver.resolveCurrentUser();
        progressService.recordLessonView(currentUser, request);
        return ResponseEntity.ok().build();
    }
}
