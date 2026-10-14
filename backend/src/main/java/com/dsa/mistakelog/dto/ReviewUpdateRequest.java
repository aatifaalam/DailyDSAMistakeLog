package com.dsa.mistakelog.dto;

import com.dsa.mistakelog.entity.ReviewStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewUpdateRequest {

    @NotNull(message = "Review status is required")
    private ReviewStatus reviewStatus;

    private LocalDate reviewDate;

    private String notes;

    private Boolean solvedIndependently;
}
