package com.dsa.mistakelog.repository;

import com.dsa.mistakelog.entity.Mistake;
import com.dsa.mistakelog.entity.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface MistakeRepository extends JpaRepository<Mistake, Long>, JpaSpecificationExecutor<Mistake> {

    boolean existsByProblemNameIgnoreCase(String problemName);

    long countByCreatedAtGreaterThanEqual(LocalDateTime startDateTime);

    long countByReviewStatus(ReviewStatus reviewStatus);

    long countByReviewStatusIn(Collection<ReviewStatus> reviewStatuses);

    List<Mistake> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT m.mistakeType, COUNT(m) FROM Mistake m GROUP BY m.mistakeType ORDER BY COUNT(m) DESC")
    List<Object[]> countGroupByMistakeType();

    @Query("SELECT FUNCTION('DATE', m.createdAt), COUNT(m) FROM Mistake m WHERE m.createdAt >= :startDate GROUP BY FUNCTION('DATE', m.createdAt) ORDER BY FUNCTION('DATE', m.createdAt) ASC")
    List<Object[]> countGroupByDate(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT m.topic, COUNT(m) FROM Mistake m WHERE m.topic IS NOT NULL AND TRIM(m.topic) != '' GROUP BY m.topic ORDER BY COUNT(m) DESC")
    List<Object[]> countGroupByTopic();
}
