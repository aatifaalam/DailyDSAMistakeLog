package com.dsa.mistakelog.service;

import com.dsa.mistakelog.dto.*;
import com.dsa.mistakelog.entity.Mistake;
import com.dsa.mistakelog.entity.MistakeType;
import com.dsa.mistakelog.entity.ReviewStatus;
import com.dsa.mistakelog.exception.ResourceNotFoundException;
import com.dsa.mistakelog.repository.MistakeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MistakeServiceTest {

    @Mock
    private MistakeRepository mistakeRepository;

    @InjectMocks
    private MistakeServiceImpl mistakeService;

    private Mistake sampleMistake;

    @BeforeEach
    void setUp() {
        sampleMistake = Mistake.builder()
                .id(1L)
                .problemName("Two Sum")
                .platform("LeetCode")
                .problemUrl("https://leetcode.com/problems/two-sum/")
                .topic("Arrays")
                .firstApproach("Brute force with nested loops")
                .whyWrong("O(n^2) time complexity is too slow for large inputs")
                .mistakeType(MistakeType.TIME_COMPLEXITY)
                .correctApproach("Use a hash map to look up complement in O(1)")
                .whatToChangeNextTime("Check if a hash map can trade space for time")
                .timeComplexity("O(n)")
                .spaceComplexity("O(n)")
                .solvedIndependently(true)
                .reviewStatus(ReviewStatus.NOT_REVIEWED)
                .reviewDate(null)
                .notes("Standard classic problem")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should create mistake successfully")
    void shouldCreateMistake() {
        CreateMistakeRequest request = CreateMistakeRequest.builder()
                .problemName("Two Sum")
                .platform("LeetCode")
                .problemUrl("https://leetcode.com/problems/two-sum/")
                .topic("Arrays")
                .firstApproach("Brute force with nested loops")
                .whyWrong("O(n^2) time complexity is too slow for large inputs")
                .mistakeType(MistakeType.TIME_COMPLEXITY)
                .correctApproach("Use a hash map to look up complement in O(1)")
                .whatToChangeNextTime("Check if a hash map can trade space for time")
                .timeComplexity("O(n)")
                .spaceComplexity("O(n)")
                .solvedIndependently(true)
                .notes("Standard classic problem")
                .build();

        when(mistakeRepository.save(any(Mistake.class))).thenReturn(sampleMistake);

        MistakeResponse response = mistakeService.createMistake(request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getProblemName()).isEqualTo("Two Sum");
        assertThat(response.getMistakeType()).isEqualTo(MistakeType.TIME_COMPLEXITY);
        assertThat(response.getReviewStatus()).isEqualTo(ReviewStatus.NOT_REVIEWED);
        verify(mistakeRepository, times(1)).save(any(Mistake.class));
    }

    @Test
    @DisplayName("Should retrieve mistake by ID")
    void shouldGetMistakeById() {
        when(mistakeRepository.findById(1L)).thenReturn(Optional.of(sampleMistake));

        MistakeResponse response = mistakeService.getMistakeById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getProblemName()).isEqualTo("Two Sum");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when mistake ID does not exist")
    void shouldThrowExceptionWhenMistakeNotFound() {
        when(mistakeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> mistakeService.getMistakeById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    @DisplayName("Should update an existing mistake")
    void shouldUpdateMistake() {
        UpdateMistakeRequest updateRequest = UpdateMistakeRequest.builder()
                .problemName("Two Sum - Optimized")
                .platform("LeetCode")
                .topic("HashMap")
                .firstApproach("Nested loops")
                .whyWrong("O(n^2)")
                .mistakeType(MistakeType.TIME_COMPLEXITY)
                .correctApproach("HashMap lookup")
                .whatToChangeNextTime("Use HashMap")
                .timeComplexity("O(n)")
                .spaceComplexity("O(n)")
                .solvedIndependently(true)
                .reviewStatus(ReviewStatus.REVIEWED)
                .reviewDate(LocalDate.now())
                .build();

        when(mistakeRepository.findById(1L)).thenReturn(Optional.of(sampleMistake));
        when(mistakeRepository.save(any(Mistake.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MistakeResponse response = mistakeService.updateMistake(1L, updateRequest);

        assertThat(response).isNotNull();
        assertThat(response.getProblemName()).isEqualTo("Two Sum - Optimized");
        assertThat(response.getTopic()).isEqualTo("HashMap");
        assertThat(response.getReviewStatus()).isEqualTo(ReviewStatus.REVIEWED);
    }

    @Test
    @DisplayName("Should delete an existing mistake")
    void shouldDeleteMistake() {
        when(mistakeRepository.findById(1L)).thenReturn(Optional.of(sampleMistake));
        doNothing().when(mistakeRepository).delete(sampleMistake);

        mistakeService.deleteMistake(1L);

        verify(mistakeRepository, times(1)).delete(sampleMistake);
    }

    @Test
    @DisplayName("Should update review status and review date")
    void shouldUpdateReviewStatus() {
        ReviewUpdateRequest reviewRequest = ReviewUpdateRequest.builder()
                .reviewStatus(ReviewStatus.REVIEWED)
                .reviewDate(LocalDate.now())
                .notes("Reviewed and solved again without hints")
                .solvedIndependently(true)
                .build();

        when(mistakeRepository.findById(1L)).thenReturn(Optional.of(sampleMistake));
        when(mistakeRepository.save(any(Mistake.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MistakeResponse response = mistakeService.updateReview(1L, reviewRequest);

        assertThat(response).isNotNull();
        assertThat(response.getReviewStatus()).isEqualTo(ReviewStatus.REVIEWED);
        assertThat(response.getNotes()).isEqualTo("Reviewed and solved again without hints");
        assertThat(response.getSolvedIndependently()).isTrue();
    }

    @Test
    @DisplayName("Should calculate dashboard stats accurately")
    void shouldReturnDashboardStats() {
        when(mistakeRepository.count()).thenReturn(10L);
        when(mistakeRepository.countByCreatedAtGreaterThanEqual(any(LocalDateTime.class))).thenReturn(4L);
        when(mistakeRepository.countByReviewStatus(ReviewStatus.REVIEWED)).thenReturn(6L);
        when(mistakeRepository.countByReviewStatusIn(anyList())).thenReturn(4L);
        List<Object[]> mockTypeGroup = java.util.Collections.singletonList(new Object[]{MistakeType.TIME_COMPLEXITY, 5L});
        when(mistakeRepository.countGroupByMistakeType()).thenReturn(mockTypeGroup);
        when(mistakeRepository.findTop5ByOrderByCreatedAtDesc()).thenReturn(List.of(sampleMistake));

        DashboardStatsResponse stats = mistakeService.getDashboardStats();

        assertThat(stats.getTotalMistakes()).isEqualTo(10L);
        assertThat(stats.getMistakesThisWeek()).isEqualTo(4L);
        assertThat(stats.getReviewedCount()).isEqualTo(6L);
        assertThat(stats.getNeedsReviewCount()).isEqualTo(4L);
        assertThat(stats.getMostFrequentMistakeType()).isEqualTo(MistakeType.TIME_COMPLEXITY.name());
        assertThat(stats.getRecentlyAddedMistakes()).hasSize(1);
    }

    @Test
    @DisplayName("Should paginate mistakes with filter criteria")
    @SuppressWarnings("unchecked")
    void shouldGetPaginatedMistakes() {
        Page<Mistake> page = new PageImpl<>(List.of(sampleMistake), PageRequest.of(0, 10), 1);
        when(mistakeRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        MistakeFilterCriteria criteria = MistakeFilterCriteria.builder()
                .search("Two")
                .topic("Arrays")
                .build();

        PageResponse<MistakeResponse> response = mistakeService.getMistakes(criteria, PageRequest.of(0, 10));

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getTotalElements()).isEqualTo(1L);
        assertThat(response.getPageNumber()).isEqualTo(0);
    }
}
