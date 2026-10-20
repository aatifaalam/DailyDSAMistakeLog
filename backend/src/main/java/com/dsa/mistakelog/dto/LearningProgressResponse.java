package com.dsa.mistakelog.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningProgressResponse {
    private List<String> completedPointIds;
    private List<String> bookmarkedPointIds;
    private long totalCompletedPoints;
    private String lastAccessedTopicSlug;
    private String lastAccessedLessonSlug;
    private Map<String, Long> topicCompletedCounts;
}
