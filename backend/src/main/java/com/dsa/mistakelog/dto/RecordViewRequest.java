package com.dsa.mistakelog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordViewRequest {

    @NotBlank(message = "Topic slug is required")
    private String topicSlug;

    @NotBlank(message = "Lesson slug is required")
    private String lessonSlug;

    private String learningPointId;
}
