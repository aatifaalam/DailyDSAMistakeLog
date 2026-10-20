package com.dsa.mistakelog.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicProgressDto {
    private String topicSlug;
    private long completedCount;
}
