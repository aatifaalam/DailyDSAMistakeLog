package com.dsa.mistakelog.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakesOverTimeStat {

    private LocalDate date;
    private long count;
}
