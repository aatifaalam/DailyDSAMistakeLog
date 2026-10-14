package com.dsa.mistakelog.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private long totalMistakes;
    private long mistakesThisWeek;
    private long reviewedCount;
    private long needsReviewCount;
    private String mostFrequentMistakeType;
    private String mostFrequentMistakeTypeLabel;
    private List<MistakeResponse> recentlyAddedMistakes;
}
