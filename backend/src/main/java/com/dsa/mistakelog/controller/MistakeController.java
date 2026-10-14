package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.dto.*;
import com.dsa.mistakelog.entity.MistakeType;
import com.dsa.mistakelog.entity.ReviewStatus;
import com.dsa.mistakelog.service.MistakeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/mistakes")
@RequiredArgsConstructor
public class MistakeController {

    private final MistakeService mistakeService;

    @PostMapping
    public ResponseEntity<MistakeResponse> createMistake(@Valid @RequestBody CreateMistakeRequest request) {
        MistakeResponse response = mistakeService.createMistake(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponse<MistakeResponse>> getMistakes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) MistakeType mistakeType,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) ReviewStatus reviewStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        MistakeFilterCriteria criteria = MistakeFilterCriteria.builder()
                .search(search)
                .mistakeType(mistakeType)
                .topic(topic)
                .platform(platform)
                .reviewStatus(reviewStatus)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        PageResponse<MistakeResponse> response = mistakeService.getMistakes(criteria, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MistakeResponse> getMistakeById(@PathVariable Long id) {
        MistakeResponse response = mistakeService.getMistakeById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MistakeResponse> updateMistake(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMistakeRequest request) {
        MistakeResponse response = mistakeService.updateMistake(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMistake(@PathVariable Long id) {
        mistakeService.deleteMistake(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<MistakeResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewUpdateRequest request) {
        MistakeResponse response = mistakeService.updateReview(id, request);
        return ResponseEntity.ok(response);
    }
}
