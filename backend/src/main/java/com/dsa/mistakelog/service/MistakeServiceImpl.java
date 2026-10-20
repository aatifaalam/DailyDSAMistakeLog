package com.dsa.mistakelog.service;

import com.dsa.mistakelog.dto.*;
import com.dsa.mistakelog.entity.Mistake;
import com.dsa.mistakelog.entity.MistakeType;
import com.dsa.mistakelog.entity.ReviewStatus;
import com.dsa.mistakelog.entity.User;
import com.dsa.mistakelog.exception.ResourceNotFoundException;
import com.dsa.mistakelog.repository.MistakeRepository;
import com.dsa.mistakelog.repository.MistakeSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MistakeServiceImpl implements MistakeService {

    private final MistakeRepository mistakeRepository;

    private static final Set<String> ALLOWED_SORT_PROPERTIES = Set.of(
            "id", "problemname", "createdat", "updatedat", "reviewdate",
            "mistaketype", "topic", "platform", "reviewstatus"
    );

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MistakeResponse> getMistakes(User user, MistakeFilterCriteria criteria, Pageable pageable) {
        Pageable validatedPageable = validateAndSanitizePageable(pageable);
        Specification<Mistake> spec = MistakeSpecification.withCriteriaAndUser(criteria, user);
        Page<Mistake> page = mistakeRepository.findAll(spec, validatedPageable);
        return PageResponse.fromPage(page.map(MistakeResponse::fromEntity));
    }

    @Override
    @Transactional(readOnly = true)
    public MistakeResponse getMistakeById(Long id, User user) {
        Mistake mistake = mistakeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Mistake", "id", id));
        return MistakeResponse.fromEntity(mistake);
    }

    @Override
    public MistakeResponse createMistake(CreateMistakeRequest request, User user) {
        Mistake mistake = Mistake.builder()
                .user(user)
                .problemName(request.getProblemName().trim())
                .platform(request.getPlatform() != null ? request.getPlatform().trim() : null)
                .problemUrl(request.getProblemUrl() != null && !request.getProblemUrl().isBlank() ? request.getProblemUrl().trim() : null)
                .topic(request.getTopic() != null ? request.getTopic().trim() : null)
                .firstApproach(request.getFirstApproach())
                .whyWrong(request.getWhyWrong())
                .mistakeType(request.getMistakeType())
                .correctApproach(request.getCorrectApproach())
                .whatToChangeNextTime(request.getWhatToChangeNextTime())
                .timeComplexity(request.getTimeComplexity() != null ? request.getTimeComplexity().trim() : null)
                .spaceComplexity(request.getSpaceComplexity() != null ? request.getSpaceComplexity().trim() : null)
                .solvedIndependently(Boolean.TRUE.equals(request.getSolvedIndependently()))
                .reviewStatus(ReviewStatus.NOT_REVIEWED)
                .reviewDate(request.getReviewDate())
                .notes(request.getNotes())
                .build();

        Mistake saved = mistakeRepository.save(mistake);
        log.info("User {} created new mistake log with id: {}", user.getEmail(), saved.getId());
        return MistakeResponse.fromEntity(saved);
    }

    @Override
    public MistakeResponse updateMistake(Long id, UpdateMistakeRequest request, User user) {
        Mistake existing = mistakeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Mistake", "id", id));

        existing.setProblemName(request.getProblemName().trim());
        existing.setPlatform(request.getPlatform() != null ? request.getPlatform().trim() : null);
        existing.setProblemUrl(request.getProblemUrl() != null && !request.getProblemUrl().isBlank() ? request.getProblemUrl().trim() : null);
        existing.setTopic(request.getTopic() != null ? request.getTopic().trim() : null);
        existing.setFirstApproach(request.getFirstApproach());
        existing.setWhyWrong(request.getWhyWrong());
        existing.setMistakeType(request.getMistakeType());
        existing.setCorrectApproach(request.getCorrectApproach());
        existing.setWhatToChangeNextTime(request.getWhatToChangeNextTime());
        existing.setTimeComplexity(request.getTimeComplexity() != null ? request.getTimeComplexity().trim() : null);
        existing.setSpaceComplexity(request.getSpaceComplexity() != null ? request.getSpaceComplexity().trim() : null);

        if (request.getSolvedIndependently() != null) {
            existing.setSolvedIndependently(request.getSolvedIndependently());
        }

        if (request.getReviewStatus() != null) {
            existing.setReviewStatus(request.getReviewStatus());
        }

        if (request.getReviewDate() != null) {
            existing.setReviewDate(request.getReviewDate());
        }

        if (request.getNotes() != null) {
            existing.setNotes(request.getNotes());
        }

        Mistake updated = mistakeRepository.save(existing);
        log.info("User {} updated mistake log with id: {}", user.getEmail(), updated.getId());
        return MistakeResponse.fromEntity(updated);
    }

    @Override
    public void deleteMistake(Long id, User user) {
        Mistake existing = mistakeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Mistake", "id", id));
        mistakeRepository.delete(existing);
        log.info("User {} deleted mistake log with id: {}", user.getEmail(), id);
    }

    @Override
    public MistakeResponse updateReview(Long id, ReviewUpdateRequest request, User user) {
        Mistake existing = mistakeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Mistake", "id", id));

        existing.setReviewStatus(request.getReviewStatus());

        if (request.getReviewDate() != null) {
            existing.setReviewDate(request.getReviewDate());
        } else if (request.getReviewStatus() == ReviewStatus.REVIEWED && existing.getReviewDate() == null) {
            existing.setReviewDate(LocalDate.now());
        }

        if (request.getNotes() != null) {
            existing.setNotes(request.getNotes());
        }

        if (request.getSolvedIndependently() != null) {
            existing.setSolvedIndependently(request.getSolvedIndependently());
        }

        Mistake updated = mistakeRepository.save(existing);
        log.info("User {} updated review for mistake id: {} to {}", user.getEmail(), id, request.getReviewStatus());
        return MistakeResponse.fromEntity(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(User user) {
        long totalMistakes = mistakeRepository.countByUser(user);

        LocalDateTime startOfWeek = LocalDate.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();
        long mistakesThisWeek = mistakeRepository.countByUserAndCreatedAtGreaterThanEqual(user, startOfWeek);

        long reviewedCount = mistakeRepository.countByUserAndReviewStatus(user, ReviewStatus.REVIEWED);
        long needsReviewCount = mistakeRepository.countByUserAndReviewStatusIn(
                user,
                List.of(ReviewStatus.NOT_REVIEWED, ReviewStatus.NEEDS_ANOTHER_REVIEW)
        );

        List<Object[]> typeGroup = mistakeRepository.countGroupByUserAndMistakeType(user);
        String mostFrequentType = null;
        String mostFrequentTypeLabel = null;
        if (!typeGroup.isEmpty()) {
            Object typeObj = typeGroup.get(0)[0];
            if (typeObj instanceof MistakeType mt) {
                mostFrequentType = mt.name();
                mostFrequentTypeLabel = mt.getDisplayName();
            } else if (typeObj != null) {
                mostFrequentType = typeObj.toString();
                try {
                    mostFrequentTypeLabel = MistakeType.fromString(mostFrequentType).getDisplayName();
                } catch (Exception e) {
                    mostFrequentTypeLabel = mostFrequentType;
                }
            }
        }

        List<MistakeResponse> recentlyAdded = mistakeRepository.findTop5ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(MistakeResponse::fromEntity)
                .toList();

        return DashboardStatsResponse.builder()
                .totalMistakes(totalMistakes)
                .mistakesThisWeek(mistakesThisWeek)
                .reviewedCount(reviewedCount)
                .needsReviewCount(needsReviewCount)
                .mostFrequentMistakeType(mostFrequentType)
                .mostFrequentMistakeTypeLabel(mostFrequentTypeLabel)
                .recentlyAddedMistakes(recentlyAdded)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MistakeTypeStat> getMistakesByType(User user) {
        List<Object[]> results = mistakeRepository.countGroupByUserAndMistakeType(user);
        Map<MistakeType, Long> countsMap = new EnumMap<>(MistakeType.class);

        for (Object[] row : results) {
            MistakeType type;
            if (row[0] instanceof MistakeType mt) {
                type = mt;
            } else if (row[0] != null) {
                type = MistakeType.fromString(row[0].toString());
            } else {
                continue;
            }
            long count = ((Number) row[1]).longValue();
            countsMap.put(type, count);
        }

        List<MistakeTypeStat> stats = new ArrayList<>();
        for (MistakeType type : MistakeType.values()) {
            stats.add(MistakeTypeStat.builder()
                    .mistakeType(type)
                    .label(type.getDisplayName())
                    .count(countsMap.getOrDefault(type, 0L))
                    .build());
        }

        stats.sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MistakesOverTimeStat> getMistakesOverTime(User user, int days) {
        int windowDays = (days > 0 && days <= 365) ? days : 14;
        LocalDateTime startDate = LocalDate.now().minusDays(windowDays - 1L).atStartOfDay();
        List<Object[]> results = mistakeRepository.countGroupByUserAndDate(user, startDate);

        Map<LocalDate, Long> countsMap = new HashMap<>();
        for (Object[] row : results) {
            LocalDate date;
            if (row[0] instanceof java.sql.Date sqlDate) {
                date = sqlDate.toLocalDate();
            } else if (row[0] instanceof LocalDate ld) {
                date = ld;
            } else if (row[0] != null) {
                date = LocalDate.parse(row[0].toString());
            } else {
                continue;
            }
            long count = ((Number) row[1]).longValue();
            countsMap.put(date, count);
        }

        List<MistakesOverTimeStat> timeline = new ArrayList<>();
        LocalDate current = startDate.toLocalDate();
        LocalDate today = LocalDate.now();
        while (!current.isAfter(today)) {
            timeline.add(MistakesOverTimeStat.builder()
                    .date(current)
                    .count(countsMap.getOrDefault(current, 0L))
                    .build());
            current = current.plusDays(1);
        }

        return timeline;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopicStat> getMistakesByTopic(User user) {
        List<Object[]> results = mistakeRepository.countGroupByUserAndTopic(user);
        List<TopicStat> stats = new ArrayList<>();
        for (Object[] row : results) {
            if (row[0] != null) {
                stats.add(TopicStat.builder()
                        .topic(row[0].toString())
                        .count(((Number) row[1]).longValue())
                        .build());
            }
        }
        return stats;
    }

    private Pageable validateAndSanitizePageable(Pageable pageable) {
        if (pageable.getSort().isUnsorted()) {
            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        List<Sort.Order> sanitizedOrders = new ArrayList<>();
        for (Sort.Order order : pageable.getSort()) {
            String property = order.getProperty().replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
            if (ALLOWED_SORT_PROPERTIES.contains(property)) {
                String entityProperty = switch (property) {
                    case "problemname" -> "problemName";
                    case "createdat" -> "createdAt";
                    case "updatedat" -> "updatedAt";
                    case "reviewdate" -> "reviewDate";
                    case "mistaketype" -> "mistakeType";
                    case "reviewstatus" -> "reviewStatus";
                    default -> property;
                };
                sanitizedOrders.add(new Sort.Order(order.getDirection(), entityProperty));
            } else {
                log.warn("Ignored untrusted sort property: {}", order.getProperty());
            }
        }

        if (sanitizedOrders.isEmpty()) {
            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(sanitizedOrders));
    }
}
