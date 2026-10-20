package com.dsa.mistakelog.service;

import com.dsa.mistakelog.dto.LearningProgressResponse;
import com.dsa.mistakelog.dto.RecordViewRequest;
import com.dsa.mistakelog.dto.ToggleProgressRequest;
import com.dsa.mistakelog.entity.User;

import java.util.Map;

public interface LearningProgressService {

    LearningProgressResponse getUserProgress(User user);

    Map<String, Object> getTopicProgress(User user, String topicSlug);

    LearningProgressResponse toggleProgress(User user, ToggleProgressRequest request);

    void recordLessonView(User user, RecordViewRequest request);
}
