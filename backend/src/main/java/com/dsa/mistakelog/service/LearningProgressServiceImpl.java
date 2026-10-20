package com.dsa.mistakelog.service;

import com.dsa.mistakelog.dto.LearningProgressResponse;
import com.dsa.mistakelog.dto.RecordViewRequest;
import com.dsa.mistakelog.dto.ToggleProgressRequest;
import com.dsa.mistakelog.entity.LearningProgress;
import com.dsa.mistakelog.entity.User;
import com.dsa.mistakelog.repository.LearningProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LearningProgressServiceImpl implements LearningProgressService {

    private final LearningProgressRepository progressRepository;

    @Override
    @Transactional(readOnly = true)
    public LearningProgressResponse getUserProgress(User user) {
        List<LearningProgress> allRecords = progressRepository.findByUser(user);

        List<String> completedPointIds = allRecords.stream()
                .filter(LearningProgress::isCompleted)
                .map(LearningProgress::getLearningPointId)
                .collect(Collectors.toList());

        List<String> bookmarkedPointIds = allRecords.stream()
                .filter(LearningProgress::isBookmarked)
                .map(LearningProgress::getLearningPointId)
                .collect(Collectors.toList());

        Map<String, Long> topicCompletedCounts = allRecords.stream()
                .filter(LearningProgress::isCompleted)
                .collect(Collectors.groupingBy(
                        LearningProgress::getTopicSlug,
                        Collectors.counting()
                ));

        Optional<LearningProgress> lastViewed = progressRepository.findFirstByUserOrderByLastViewedAtDesc(user);

        String lastTopic = lastViewed.map(LearningProgress::getTopicSlug).orElse("arrays-and-strings");
        String lastLesson = lastViewed.map(LearningProgress::getLessonSlug).orElse("intro-to-arrays");

        return LearningProgressResponse.builder()
                .completedPointIds(completedPointIds)
                .bookmarkedPointIds(bookmarkedPointIds)
                .totalCompletedPoints(completedPointIds.size())
                .lastAccessedTopicSlug(lastTopic)
                .lastAccessedLessonSlug(lastLesson)
                .topicCompletedCounts(topicCompletedCounts)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getTopicProgress(User user, String topicSlug) {
        List<LearningProgress> topicRecords = progressRepository.findByUserAndTopicSlug(user, topicSlug);

        List<String> completedPointIds = topicRecords.stream()
                .filter(LearningProgress::isCompleted)
                .map(LearningProgress::getLearningPointId)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("topicSlug", topicSlug);
        response.put("completedPointIds", completedPointIds);
        response.put("completedCount", (long) completedPointIds.size());
        return response;
    }

    @Override
    @Transactional
    public LearningProgressResponse toggleProgress(User user, ToggleProgressRequest request) {
        LearningProgress progress = progressRepository
                .findByUserAndLearningPointId(user, request.getLearningPointId())
                .orElseGet(() -> LearningProgress.builder()
                        .user(user)
                        .learningPointId(request.getLearningPointId())
                        .topicSlug(request.getTopicSlug())
                        .lessonSlug(request.getLessonSlug())
                        .completed(false)
                        .bookmarked(false)
                        .lastViewedAt(LocalDateTime.now())
                        .build());

        boolean newCompleted = request.getCompleted() != null
                ? request.getCompleted()
                : !progress.isCompleted();

        progress.setCompleted(newCompleted);
        progress.setCompletedAt(newCompleted ? LocalDateTime.now() : null);
        progress.setLastViewedAt(LocalDateTime.now());
        progress.setTopicSlug(request.getTopicSlug());
        progress.setLessonSlug(request.getLessonSlug());

        progressRepository.save(progress);
        log.info("User {} toggled learning point {} to completed={}", user.getEmail(), request.getLearningPointId(), newCompleted);

        return getUserProgress(user);
    }

    @Override
    @Transactional
    public void recordLessonView(User user, RecordViewRequest request) {
        String pointId = request.getLearningPointId() != null && !request.getLearningPointId().isBlank()
                ? request.getLearningPointId()
                : request.getLessonSlug() + "-session";

        LearningProgress progress = progressRepository
                .findByUserAndLearningPointId(user, pointId)
                .orElseGet(() -> LearningProgress.builder()
                        .user(user)
                        .learningPointId(pointId)
                        .topicSlug(request.getTopicSlug())
                        .lessonSlug(request.getLessonSlug())
                        .completed(false)
                        .bookmarked(false)
                        .build());

        progress.setTopicSlug(request.getTopicSlug());
        progress.setLessonSlug(request.getLessonSlug());
        progress.setLastViewedAt(LocalDateTime.now());

        progressRepository.save(progress);
    }
}
