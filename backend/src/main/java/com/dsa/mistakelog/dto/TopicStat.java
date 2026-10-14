package com.dsa.mistakelog.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicStat {

    private String topic;
    private long count;
}
