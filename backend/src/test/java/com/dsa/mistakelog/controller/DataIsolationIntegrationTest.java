package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.config.JwtTokenService;
import com.dsa.mistakelog.dto.ReviewUpdateRequest;
import com.dsa.mistakelog.dto.UpdateMistakeRequest;
import com.dsa.mistakelog.entity.Mistake;
import com.dsa.mistakelog.entity.MistakeType;
import com.dsa.mistakelog.entity.ReviewStatus;
import com.dsa.mistakelog.entity.User;
import com.dsa.mistakelog.entity.UserRole;
import com.dsa.mistakelog.repository.MistakeRepository;
import com.dsa.mistakelog.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class DataIsolationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MistakeRepository mistakeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenService jwtTokenService;

    private User userA;
    private User userB;
    private String tokenA;
    private String tokenB;
    private Mistake mistakeOfUserA;

    @BeforeEach
    void setUp() {
        mistakeRepository.deleteAll();
        userRepository.deleteAll();

        userA = userRepository.save(User.builder()
                .name("User Alpha")
                .email("alpha@domain.com")
                .password(passwordEncoder.encode("Password@123"))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        userB = userRepository.save(User.builder()
                .name("User Beta")
                .email("beta@domain.com")
                .password(passwordEncoder.encode("Password@456"))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        tokenA = "Bearer " + jwtTokenService.generateToken(userA);
        tokenB = "Bearer " + jwtTokenService.generateToken(userB);

        mistakeOfUserA = mistakeRepository.save(Mistake.builder()
                .user(userA)
                .problemName("Alpha Secret Problem")
                .platform("LeetCode")
                .problemUrl("https://leetcode.com/problems/secret/")
                .topic("Dynamic Programming")
                .firstApproach("Recursion without memoization")
                .whyWrong("Exponential time complexity O(2^n)")
                .mistakeType(MistakeType.TIME_COMPLEXITY)
                .correctApproach("Bottom up DP table")
                .whatToChangeNextTime("Recognize overlapping subproblems")
                .timeComplexity("O(n)")
                .spaceComplexity("O(n)")
                .solvedIndependently(true)
                .reviewStatus(ReviewStatus.NOT_REVIEWED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());
    }

    @Test
    @DisplayName("User A can view their own mistake, but User B receives 404 Not Found")
    void testUserBCannotGetMistakeOfUserA() throws Exception {
        // User A succeeds
        mockMvc.perform(get("/api/mistakes/{id}", mistakeOfUserA.getId())
                        .header(HttpHeaders.AUTHORIZATION, tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.problemName").value("Alpha Secret Problem"));

        // User B fails with 404
        mockMvc.perform(get("/api/mistakes/{id}", mistakeOfUserA.getId())
                        .header(HttpHeaders.AUTHORIZATION, tokenB))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(containsString("not found")));
    }

    @Test
    @DisplayName("User B cannot update User A's mistake")
    void testUserBCannotUpdateMistakeOfUserA() throws Exception {
        UpdateMistakeRequest update = UpdateMistakeRequest.builder()
                .problemName("Tampered Problem Name")
                .platform("LeetCode")
                .topic("Hacked Topic")
                .firstApproach("Tampered first approach")
                .whyWrong("Tampered reason")
                .mistakeType(MistakeType.WRONG_ALGORITHM)
                .correctApproach("Tampered correct approach")
                .whatToChangeNextTime("Tampered advice")
                .timeComplexity("O(1)")
                .spaceComplexity("O(1)")
                .solvedIndependently(false)
                .reviewStatus(ReviewStatus.REVIEWED)
                .build();

        mockMvc.perform(put("/api/mistakes/{id}", mistakeOfUserA.getId())
                        .header(HttpHeaders.AUTHORIZATION, tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isNotFound());

        // Verify in DB that User A's mistake was NOT changed
        Mistake persisted = mistakeRepository.findById(mistakeOfUserA.getId()).orElseThrow();
        assertThat(persisted.getProblemName()).isEqualTo("Alpha Secret Problem");
    }

    @Test
    @DisplayName("User B cannot delete User A's mistake")
    void testUserBCannotDeleteMistakeOfUserA() throws Exception {
        mockMvc.perform(delete("/api/mistakes/{id}", mistakeOfUserA.getId())
                        .header(HttpHeaders.AUTHORIZATION, tokenB))
                .andExpect(status().isNotFound());

        // Verify still exists in database
        assertThat(mistakeRepository.existsById(mistakeOfUserA.getId())).isTrue();
    }

    @Test
    @DisplayName("User B cannot mark User A's mistake as reviewed")
    void testUserBCannotReviewMistakeOfUserA() throws Exception {
        ReviewUpdateRequest review = ReviewUpdateRequest.builder()
                .reviewStatus(ReviewStatus.REVIEWED)
                .reviewDate(LocalDate.now())
                .notes("Hacked review note")
                .solvedIndependently(true)
                .build();

        mockMvc.perform(patch("/api/mistakes/{id}/review", mistakeOfUserA.getId())
                        .header(HttpHeaders.AUTHORIZATION, tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(review)))
                .andExpect(status().isNotFound());

        Mistake persisted = mistakeRepository.findById(mistakeOfUserA.getId()).orElseThrow();
        assertThat(persisted.getReviewStatus()).isEqualTo(ReviewStatus.NOT_REVIEWED);
    }

    @Test
    @DisplayName("User B listing mistakes does NOT see User A's mistake")
    void testUserBListExcludesUserAMistakes() throws Exception {
        // User A list has 1 mistake
        mockMvc.perform(get("/api/mistakes")
                        .header(HttpHeaders.AUTHORIZATION, tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].problemName").value("Alpha Secret Problem"));

        // User B list has 0 mistakes
        mockMvc.perform(get("/api/mistakes")
                        .header(HttpHeaders.AUTHORIZATION, tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)))
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    @DisplayName("User B search and topic filtering does NOT leak User A's mistake")
    void testUserBSearchDoesNotLeakUserAMistake() throws Exception {
        mockMvc.perform(get("/api/mistakes")
                        .header(HttpHeaders.AUTHORIZATION, tokenB)
                        .param("search", "Alpha")
                        .param("topic", "Dynamic Programming"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)));
    }

    @Test
    @DisplayName("User B dashboard stats are isolated from User A's data")
    void testUserBDashboardStatsAreIsolated() throws Exception {
        // User A dashboard shows 1 mistake
        mockMvc.perform(get("/api/dashboard/stats")
                        .header(HttpHeaders.AUTHORIZATION, tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalMistakes").value(1))
                .andExpect(jsonPath("$.needsReviewCount").value(1));

        // User B dashboard shows 0 mistakes
        mockMvc.perform(get("/api/dashboard/stats")
                        .header(HttpHeaders.AUTHORIZATION, tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalMistakes").value(0))
                .andExpect(jsonPath("$.recentlyAddedMistakes", hasSize(0)));
    }

    @Test
    @DisplayName("User B breakdown by type is isolated and has zero counts for all types")
    void testUserBBreakdownByTypeIsIsolated() throws Exception {
        // User A has 1 TIME_COMPLEXITY mistake
        mockMvc.perform(get("/api/dashboard/mistakes-by-type")
                        .header(HttpHeaders.AUTHORIZATION, tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.mistakeType == 'TIME_COMPLEXITY')].count", contains(1)));

        // User B has 0 count for all types
        mockMvc.perform(get("/api/dashboard/mistakes-by-type")
                        .header(HttpHeaders.AUTHORIZATION, tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.count > 0)]", hasSize(0)));
    }
}
