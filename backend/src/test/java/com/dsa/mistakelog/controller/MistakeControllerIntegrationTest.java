package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.config.JwtTokenService;
import com.dsa.mistakelog.dto.CreateMistakeRequest;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class MistakeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MistakeRepository mistakeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private String authToken;
    private Mistake savedMistake;

    @BeforeEach
    void setUp() {
        mistakeRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(User.builder()
                .name("Alice Test")
                .email("alice@test.com")
                .password(passwordEncoder.encode("Password@123"))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        authToken = "Bearer " + jwtTokenService.generateToken(testUser);

        Mistake mistake = Mistake.builder()
                .user(testUser)
                .problemName("Daily Temperatures")
                .platform("LeetCode")
                .problemUrl("https://leetcode.com/problems/daily-temperatures/")
                .topic("Stack")
                .firstApproach("Only check the next element in the temperatures array.")
                .whyWrong("I assumed that the next warmer temperature would always be on the immediately following day.")
                .mistakeType(MistakeType.WRONG_ALGORITHM)
                .correctApproach("Use a monotonic decreasing stack of indices.")
                .whatToChangeNextTime("Optimize using a monotonic stack.")
                .timeComplexity("O(n)")
                .spaceComplexity("O(n)")
                .solvedIndependently(true)
                .reviewStatus(ReviewStatus.NOT_REVIEWED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        savedMistake = mistakeRepository.save(mistake);
    }

    @Test
    @DisplayName("Unauthenticated request to /api/mistakes should return 401 Unauthorized")
    void testUnauthenticatedAccessRejected() throws Exception {
        mockMvc.perform(get("/api/mistakes"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("POST /api/mistakes should create mistake and return 201")
    void testCreateMistake() throws Exception {
        CreateMistakeRequest request = CreateMistakeRequest.builder()
                .problemName("Binary Tree Level Order Traversal")
                .platform("LeetCode")
                .problemUrl("https://leetcode.com/problems/binary-tree-level-order-traversal/")
                .topic("Trees")
                .firstApproach("Used DFS without level tracking")
                .whyWrong("DFS visits deeply rather than level by level, grouping was wrong")
                .mistakeType(MistakeType.WRONG_ALGORITHM)
                .correctApproach("Use BFS with a Queue and record queue size per level")
                .whatToChangeNextTime("Level by level order traversal strongly indicates BFS")
                .timeComplexity("O(n)")
                .spaceComplexity("O(n)")
                .solvedIndependently(true)
                .build();

        mockMvc.perform(post("/api/mistakes")
                        .header(HttpHeaders.AUTHORIZATION, authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.problemName").value("Binary Tree Level Order Traversal"))
                .andExpect(jsonPath("$.mistakeType").value("WRONG_ALGORITHM"))
                .andExpect(jsonPath("$.reviewStatus").value("NOT_REVIEWED"));
    }

    @Test
    @DisplayName("POST /api/mistakes with invalid input should return 400 Bad Request with field errors")
    void testCreateMistakeInvalidValidation() throws Exception {
        CreateMistakeRequest invalidRequest = CreateMistakeRequest.builder()
                .problemName("") // blank problemName
                .firstApproach("") // blank firstApproach
                .whyWrong("") // blank whyWrong
                .whatToChangeNextTime("") // blank whatToChangeNextTime
                .build();

        mockMvc.perform(post("/api/mistakes")
                        .header(HttpHeaders.AUTHORIZATION, authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.problemName").exists())
                .andExpect(jsonPath("$.validationErrors.firstApproach").exists())
                .andExpect(jsonPath("$.validationErrors.whyWrong").exists())
                .andExpect(jsonPath("$.validationErrors.mistakeType").exists());
    }

    @Test
    @DisplayName("GET /api/mistakes should return paginated list")
    void testGetMistakesPaginated() throws Exception {
        mockMvc.perform(get("/api/mistakes")
                        .header(HttpHeaders.AUTHORIZATION, authToken)
                        .param("page", "0")
                        .param("size", "10")
                        .param("sort", "createdAt,desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.totalElements").value(greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.pageNumber").value(0));
    }

    @Test
    @DisplayName("GET /api/mistakes with search and topic filters")
    void testGetMistakesWithFilters() throws Exception {
        mockMvc.perform(get("/api/mistakes")
                        .header(HttpHeaders.AUTHORIZATION, authToken)
                        .param("search", "Temperatures")
                        .param("topic", "Stack")
                        .param("mistakeType", "WRONG_ALGORITHM"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].problemName").value("Daily Temperatures"));
    }

    @Test
    @DisplayName("GET /api/mistakes/{id} should return mistake by ID")
    void testGetMistakeById() throws Exception {
        mockMvc.perform(get("/api/mistakes/{id}", savedMistake.getId())
                        .header(HttpHeaders.AUTHORIZATION, authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedMistake.getId()))
                .andExpect(jsonPath("$.problemName").value("Daily Temperatures"));
    }

    @Test
    @DisplayName("GET /api/mistakes/{id} with nonexistent ID should return 404")
    void testGetMistakeNotFound() throws Exception {
        mockMvc.perform(get("/api/mistakes/{id}", 999999L)
                        .header(HttpHeaders.AUTHORIZATION, authToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(containsString("not found")));
    }

    @Test
    @DisplayName("PUT /api/mistakes/{id} should update existing mistake")
    void testUpdateMistake() throws Exception {
        UpdateMistakeRequest updateRequest = UpdateMistakeRequest.builder()
                .problemName("Daily Temperatures - Monotonic Stack")
                .platform("LeetCode")
                .problemUrl("https://leetcode.com/problems/daily-temperatures/")
                .topic("Stack")
                .firstApproach("Checking next element only")
                .whyWrong("Only looked at immediate neighbor")
                .mistakeType(MistakeType.WRONG_ALGORITHM)
                .correctApproach("Decreasing monotonic stack")
                .whatToChangeNextTime("Use monotonic stack pattern")
                .timeComplexity("O(n)")
                .spaceComplexity("O(n)")
                .solvedIndependently(true)
                .reviewStatus(ReviewStatus.REVIEWED)
                .reviewDate(LocalDate.now())
                .notes("Mastered this pattern!")
                .build();

        mockMvc.perform(put("/api/mistakes/{id}", savedMistake.getId())
                        .header(HttpHeaders.AUTHORIZATION, authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.problemName").value("Daily Temperatures - Monotonic Stack"))
                .andExpect(jsonPath("$.reviewStatus").value("REVIEWED"))
                .andExpect(jsonPath("$.notes").value("Mastered this pattern!"));
    }

    @Test
    @DisplayName("PATCH /api/mistakes/{id}/review should update review status and notes")
    void testPatchReviewStatus() throws Exception {
        ReviewUpdateRequest reviewRequest = ReviewUpdateRequest.builder()
                .reviewStatus(ReviewStatus.NEEDS_ANOTHER_REVIEW)
                .reviewDate(LocalDate.now())
                .notes("Need to re-code monotonic stack without IDE hints")
                .solvedIndependently(false)
                .build();

        mockMvc.perform(patch("/api/mistakes/{id}/review", savedMistake.getId())
                        .header(HttpHeaders.AUTHORIZATION, authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviewStatus").value("NEEDS_ANOTHER_REVIEW"))
                .andExpect(jsonPath("$.notes").value("Need to re-code monotonic stack without IDE hints"))
                .andExpect(jsonPath("$.solvedIndependently").value(false));
    }

    @Test
    @DisplayName("DELETE /api/mistakes/{id} should delete mistake and return 204")
    void testDeleteMistake() throws Exception {
        mockMvc.perform(delete("/api/mistakes/{id}", savedMistake.getId())
                        .header(HttpHeaders.AUTHORIZATION, authToken))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/mistakes/{id}", savedMistake.getId())
                        .header(HttpHeaders.AUTHORIZATION, authToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/dashboard/stats should return dashboard summary")
    void testGetDashboardStats() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats")
                        .header(HttpHeaders.AUTHORIZATION, authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalMistakes").value(greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.recentlyAddedMistakes").isArray());
    }

    @Test
    @DisplayName("GET /api/dashboard/mistakes-by-type should return breakdown")
    void testGetMistakesByType() throws Exception {
        mockMvc.perform(get("/api/dashboard/mistakes-by-type")
                        .header(HttpHeaders.AUTHORIZATION, authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("GET /api/dashboard/mistakes-over-time should return timeline")
    void testGetMistakesOverTime() throws Exception {
        mockMvc.perform(get("/api/dashboard/mistakes-over-time")
                        .header(HttpHeaders.AUTHORIZATION, authToken)
                        .param("days", "14"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(14)));
    }
}
