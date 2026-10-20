package com.dsa.mistakelog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "learning_progress",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_learning_point", columnNames = {"user_id", "learning_point_id"})
    },
    indexes = {
        @Index(name = "idx_lp_user_point", columnList = "user_id, learning_point_id"),
        @Index(name = "idx_lp_user_topic", columnList = "user_id, topic_slug"),
        @Index(name = "idx_lp_last_viewed", columnList = "user_id, last_viewed_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "topic_slug", nullable = false, length = 100)
    private String topicSlug;

    @Column(name = "lesson_slug", nullable = false, length = 100)
    private String lessonSlug;

    @Column(name = "learning_point_id", nullable = false, length = 100)
    private String learningPointId;

    @Column(name = "completed", nullable = false)
    @Builder.Default
    private boolean completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "last_viewed_at", nullable = false)
    private LocalDateTime lastViewedAt;

    @Column(name = "bookmarked", nullable = false)
    @Builder.Default
    private boolean bookmarked = false;

    @PrePersist
    public void prePersist() {
        if (this.lastViewedAt == null) {
            this.lastViewedAt = LocalDateTime.now();
        }
    }
}
