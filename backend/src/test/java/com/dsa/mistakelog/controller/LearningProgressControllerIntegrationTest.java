package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.config.JwtTokenService;
import com.dsa.mistakelog.dto.RecordViewRequest;
import com.dsa.mistakelog.dto.ToggleProgressRequest;
import com.dsa.mistakelog.entity.User;
import com.dsa.mistakelog.entity.UserRole;
import com.dsa.mistakelog.repository.LearningProgressRepository;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class LearningProgressControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearningProgressRepository progressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenService jwtTokenService;

    private User alice;
    private User bob;
    private String aliceToken;
    private String bobToken;

    @BeforeEach
    void setUp() {
        progressRepository.deleteAll();
        userRepository.deleteAll();

        alice = userRepository.save(User.builder()
                .name("Alice Learner")
                .email("alice.learn@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(UserRole.USER)
                .build());

        bob = userRepository.save(User.builder()
                .name("Bob Learner")
                .email("bob.learn@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(UserRole.USER)
                .build());

        aliceToken = jwtTokenService.generateToken(alice);
        bobToken = jwtTokenService.generateToken(bob);
    }

    @Test
    @DisplayName("Unauthenticated request to learning progress is rejected with 401")
    void unauthenticatedRequestRejected() throws Exception {
        mockMvc.perform(get("/api/learn/progress"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Alice can toggle learning point completion and see updated progress")
    void toggleLearningPointProgress() throws Exception {
        ToggleProgressRequest toggleReq = ToggleProgressRequest.builder()
                .topicSlug("arrays-and-strings")
                .lessonSlug("intro-to-arrays")
                .learningPointId("arrays-intro-point-1")
                .completed(true)
                .build();

        mockMvc.perform(post("/api/learn/progress/toggle")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + aliceToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(toggleReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCompletedPoints", is(1)))
                .andExpect(jsonPath("$.completedPointIds", hasItem("arrays-intro-point-1")));

        // Verify get progress returns the point
        mockMvc.perform(get("/api/learn/progress")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCompletedPoints", is(1)))
                .andExpect(jsonPath("$.completedPointIds", hasItem("arrays-intro-point-1")));
    }

    @Test
    @DisplayName("Data Isolation: Bob cannot see Alice's learning progress")
    void dataIsolationBetweenUsers() throws Exception {
        ToggleProgressRequest aliceReq = ToggleProgressRequest.builder()
                .topicSlug("hashing")
                .lessonSlug("hashmap-fundamentals")
                .learningPointId("hashmap-concept-1")
                .completed(true)
                .build();

        mockMvc.perform(post("/api/learn/progress/toggle")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + aliceToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(aliceReq)))
                .andExpect(status().isOk());

        // Bob checks his progress - should be empty
        mockMvc.perform(get("/api/learn/progress")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + bobToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCompletedPoints", is(0)))
                .andExpect(jsonPath("$.completedPointIds", empty()));
    }

    @Test
    @DisplayName("Record view tracks last accessed topic and lesson for session resume")
    void recordLessonView() throws Exception {
        RecordViewRequest viewReq = RecordViewRequest.builder()
                .topicSlug("trees-and-graphs")
                .lessonSlug("binary-tree-traversals")
                .build();

        mockMvc.perform(post("/api/learn/progress/view")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + aliceToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(viewReq)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/learn/progress")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastAccessedTopicSlug", is("trees-and-graphs")))
                .andExpect(jsonPath("$.lastAccessedLessonSlug", is("binary-tree-traversals")));
    }
}
