package com.dsa.mistakelog.repository;

import com.dsa.mistakelog.entity.Mistake;
import com.dsa.mistakelog.entity.ReviewStatus;
import com.dsa.mistakelog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MistakeRepository extends JpaRepository<Mistake, Long>, JpaSpecificationExecutor<Mistake> {

    Optional<Mistake> findByIdAndUser(Long id, User user);

    boolean existsByProblemNameIgnoreCaseAndUser(String problemName, User user);

    long countByUser(User user);

    long countByUserAndCreatedAtGreaterThanEqual(User user, LocalDateTime startDateTime);

    long countByUserAndReviewStatus(User user, ReviewStatus reviewStatus);

    long countByUserAndReviewStatusIn(User user, Collection<ReviewStatus> reviewStatuses);

    List<Mistake> findTop5ByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT m.mistakeType, COUNT(m) FROM Mistake m WHERE m.user = :user GROUP BY m.mistakeType ORDER BY COUNT(m) DESC")
    List<Object[]> countGroupByUserAndMistakeType(@Param("user") User user);

    @Query("SELECT FUNCTION('DATE', m.createdAt), COUNT(m) FROM Mistake m WHERE m.user = :user AND m.createdAt >= :startDate GROUP BY FUNCTION('DATE', m.createdAt) ORDER BY FUNCTION('DATE', m.createdAt) ASC")
    List<Object[]> countGroupByUserAndDate(@Param("user") User user, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT m.topic, COUNT(m) FROM Mistake m WHERE m.user = :user AND m.topic IS NOT NULL AND TRIM(m.topic) != '' GROUP BY m.topic ORDER BY COUNT(m) DESC")
    List<Object[]> countGroupByUserAndTopic(@Param("user") User user);
}
