package com.dsa.mistakelog.dto;

import com.dsa.mistakelog.entity.MistakeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMistakeRequest {

    @NotBlank(message = "Problem name is required")
    @Size(max = 255, message = "Problem name must not exceed 255 characters")
    private String problemName;

    @Size(max = 50, message = "Platform must not exceed 50 characters")
    private String platform;

    @Pattern(regexp = "^(https?://[\\w\\d:#@%/;$()~_?\\+-=\\\\.&]*)?$", message = "Problem URL must be a valid HTTP/HTTPS URL")
    @Size(max = 1000, message = "Problem URL must not exceed 1000 characters")
    private String problemUrl;

    @Size(max = 100, message = "Topic must not exceed 100 characters")
    private String topic;

    @NotBlank(message = "My first approach is required")
    private String firstApproach;

    @NotBlank(message = "Why was it wrong is required")
    private String whyWrong;

    @NotNull(message = "Mistake type is required")
    private MistakeType mistakeType;

    private String correctApproach;

    @NotBlank(message = "What will I change next time is required")
    private String whatToChangeNextTime;

    @Size(max = 50, message = "Time complexity must not exceed 50 characters")
    private String timeComplexity;

    @Size(max = 50, message = "Space complexity must not exceed 50 characters")
    private String spaceComplexity;

    private Boolean solvedIndependently;

    private LocalDate reviewDate;

    private String notes;
}
