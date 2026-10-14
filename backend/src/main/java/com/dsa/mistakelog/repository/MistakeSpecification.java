package com.dsa.mistakelog.repository;

import com.dsa.mistakelog.dto.MistakeFilterCriteria;
import com.dsa.mistakelog.entity.Mistake;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class MistakeSpecification {

    public static Specification<Mistake> withCriteria(MistakeFilterCriteria criteria) {
        return (root, query, cb) -> {
            if (criteria == null) {
                return cb.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            // Search by problemName (case-insensitive substring) or notes
            if (StringUtils.hasText(criteria.getSearch())) {
                String searchPattern = "%" + criteria.getSearch().trim().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("problemName")), searchPattern);
                Predicate notesLike = cb.like(cb.lower(root.get("notes")), searchPattern);
                predicates.add(cb.or(nameLike, notesLike));
            }

            // Filter by mistakeType
            if (criteria.getMistakeType() != null) {
                predicates.add(cb.equal(root.get("mistakeType"), criteria.getMistakeType()));
            }

            // Filter by topic
            if (StringUtils.hasText(criteria.getTopic())) {
                predicates.add(cb.equal(cb.lower(root.get("topic")), criteria.getTopic().trim().toLowerCase()));
            }

            // Filter by platform
            if (StringUtils.hasText(criteria.getPlatform())) {
                predicates.add(cb.equal(cb.lower(root.get("platform")), criteria.getPlatform().trim().toLowerCase()));
            }

            // Filter by reviewStatus
            if (criteria.getReviewStatus() != null) {
                predicates.add(cb.equal(root.get("reviewStatus"), criteria.getReviewStatus()));
            }

            // Filter by date range (createdAt)
            if (criteria.getStartDate() != null) {
                LocalDateTime startOfDay = criteria.getStartDate().atStartOfDay();
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), startOfDay));
            }

            if (criteria.getEndDate() != null) {
                LocalDateTime endOfDay = criteria.getEndDate().atTime(LocalTime.MAX);
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), endOfDay));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
