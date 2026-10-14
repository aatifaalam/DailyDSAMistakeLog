package com.dsa.mistakelog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "mistakes",
    indexes = {
        @Index(name = "idx_mistake_topic", columnList = "topic"),
        @Index(name = "idx_mistake_type", columnList = "mistake_type"),
        @Index(name = "idx_mistake_platform", columnList = "platform"),
        @Index(name = "idx_mistake_review_status", columnList = "review_status"),
        @Index(name = "idx_mistake_created_at", columnList = "created_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mistake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_name", nullable = false, length = 255)
    private String problemName;

    @Column(name = "platform", length = 50)
    private String platform;

    @Column(name = "problem_url", length = 1000)
    private String problemUrl;

    @Column(name = "topic", length = 100)
    private String topic;

    @Column(name = "first_approach", nullable = false, columnDefinition = "TEXT")
    private String firstApproach;

    @Column(name = "why_wrong", nullable = false, columnDefinition = "TEXT")
    private String whyWrong;

    @Enumerated(EnumType.STRING)
    @Column(name = "mistake_type", nullable = false, length = 50)
    private MistakeType mistakeType;

    @Column(name = "correct_approach", columnDefinition = "TEXT")
    private String correctApproach;

    @Column(name = "what_to_change_next_time", nullable = false, columnDefinition = "TEXT")
    private String whatToChangeNextTime;

    @Column(name = "time_complexity", length = 50)
    private String timeComplexity;

    @Column(name = "space_complexity", length = 50)
    private String spaceComplexity;

    @Column(name = "solved_independently", nullable = false)
    @Builder.Default
    private Boolean solvedIndependently = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "review_status", nullable = false, length = 50)
    @Builder.Default
    private ReviewStatus reviewStatus = ReviewStatus.NOT_REVIEWED;

    @Column(name = "review_date")
    private LocalDate reviewDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
        if (this.solvedIndependently == null) {
            this.solvedIndependently = false;
        }
        if (this.reviewStatus == null) {
            this.reviewStatus = ReviewStatus.NOT_REVIEWED;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.solvedIndependently == null) {
            this.solvedIndependently = false;
        }
        if (this.reviewStatus == null) {
            this.reviewStatus = ReviewStatus.NOT_REVIEWED;
        }
    }
}
