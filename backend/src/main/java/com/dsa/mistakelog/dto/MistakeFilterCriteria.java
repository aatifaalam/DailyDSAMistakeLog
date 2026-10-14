package com.dsa.mistakelog.dto;

import com.dsa.mistakelog.entity.MistakeType;
import com.dsa.mistakelog.entity.ReviewStatus;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakeFilterCriteria {

    private String search;
    private MistakeType mistakeType;
    private String topic;
    private String platform;
    private ReviewStatus reviewStatus;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;
}
