package com.dsa.mistakelog.dto;

import com.dsa.mistakelog.entity.Mistake;
import com.dsa.mistakelog.entity.MistakeType;
import com.dsa.mistakelog.entity.ReviewStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakeResponse {

    private Long id;
    private String problemName;
    private String platform;
    private String problemUrl;
    private String topic;
    private String firstApproach;
    private String whyWrong;
    private MistakeType mistakeType;
    private String mistakeTypeDisplayName;
    private String correctApproach;
    private String whatToChangeNextTime;
    private String timeComplexity;
    private String spaceComplexity;
    private Boolean solvedIndependently;
    private ReviewStatus reviewStatus;
    private String reviewStatusDisplayName;
    private LocalDate reviewDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MistakeResponse fromEntity(Mistake mistake) {
        if (mistake == null) {
            return null;
        }
        return MistakeResponse.builder()
                .id(mistake.getId())
                .problemName(mistake.getProblemName())
                .platform(mistake.getPlatform())
                .problemUrl(mistake.getProblemUrl())
                .topic(mistake.getTopic())
                .firstApproach(mistake.getFirstApproach())
                .whyWrong(mistake.getWhyWrong())
                .mistakeType(mistake.getMistakeType())
                .mistakeTypeDisplayName(mistake.getMistakeType() != null ? mistake.getMistakeType().getDisplayName() : null)
                .correctApproach(mistake.getCorrectApproach())
                .whatToChangeNextTime(mistake.getWhatToChangeNextTime())
                .timeComplexity(mistake.getTimeComplexity())
                .spaceComplexity(mistake.getSpaceComplexity())
                .solvedIndependently(mistake.getSolvedIndependently())
                .reviewStatus(mistake.getReviewStatus())
                .reviewStatusDisplayName(mistake.getReviewStatus() != null ? mistake.getReviewStatus().getDisplayName() : null)
                .reviewDate(mistake.getReviewDate())
                .notes(mistake.getNotes())
                .createdAt(mistake.getCreatedAt())
                .updatedAt(mistake.getUpdatedAt())
                .build();
    }
}
