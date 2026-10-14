package com.dsa.mistakelog.dto;

import com.dsa.mistakelog.entity.MistakeType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakeTypeStat {

    private MistakeType mistakeType;
    private String label;
    private long count;
}
