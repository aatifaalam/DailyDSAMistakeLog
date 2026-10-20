package com.dsa.mistakelog.service;

import com.dsa.mistakelog.dto.*;
import com.dsa.mistakelog.entity.User;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MistakeService {

    PageResponse<MistakeResponse> getMistakes(User user, MistakeFilterCriteria criteria, Pageable pageable);

    MistakeResponse getMistakeById(Long id, User user);

    MistakeResponse createMistake(CreateMistakeRequest request, User user);

    MistakeResponse updateMistake(Long id, UpdateMistakeRequest request, User user);

    void deleteMistake(Long id, User user);

    MistakeResponse updateReview(Long id, ReviewUpdateRequest request, User user);

    DashboardStatsResponse getDashboardStats(User user);

    List<MistakeTypeStat> getMistakesByType(User user);

    List<MistakesOverTimeStat> getMistakesOverTime(User user, int days);

    List<TopicStat> getMistakesByTopic(User user);
}
