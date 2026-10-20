package com.dsa.mistakelog.repository;

import com.dsa.mistakelog.entity.LearningProgress;
import com.dsa.mistakelog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {

    List<LearningProgress> findByUser(User user);

    List<LearningProgress> findByUserAndTopicSlug(User user, String topicSlug);

    Optional<LearningProgress> findByUserAndLearningPointId(User user, String learningPointId);

    Optional<LearningProgress> findFirstByUserOrderByLastViewedAtDesc(User user);

    long countByUserAndCompletedTrue(User user);

    long countByUserAndTopicSlugAndCompletedTrue(User user, String topicSlug);
}
