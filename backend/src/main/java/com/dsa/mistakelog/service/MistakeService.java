package com.dsa.mistakelog.service;

import com.dsa.mistakelog.dto.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MistakeService {

    PageResponse<MistakeResponse> getMistakes(MistakeFilterCriteria criteria, Pageable pageable);

    MistakeResponse getMistakeById(Long id);

    MistakeResponse createMistake(CreateMistakeRequest request);

    MistakeResponse updateMistake(Long id, UpdateMistakeRequest request);

    void deleteMistake(Long id);

    MistakeResponse updateReview(Long id, ReviewUpdateRequest request);

    DashboardStatsResponse getDashboardStats();

    List<MistakeTypeStat> getMistakesByType();

    List<MistakesOverTimeStat> getMistakesOverTime(int days);

    List<TopicStat> getMistakesByTopic();
}
