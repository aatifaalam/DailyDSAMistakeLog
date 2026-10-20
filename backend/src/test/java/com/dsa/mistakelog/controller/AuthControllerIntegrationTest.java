package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.config.JwtTokenService;
import com.dsa.mistakelog.dto.ChangePasswordRequest;
import com.dsa.mistakelog.dto.LoginRequest;
import com.dsa.mistakelog.dto.RegisterRequest;
import com.dsa.mistakelog.dto.UpdateProfileRequest;
import com.dsa.mistakelog.entity.User;
import com.dsa.mistakelog.entity.UserRole;
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

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenService jwtTokenService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/auth/register should create user and return 201 with JWT and safe user profile")
    void testSuccessfulRegistration() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .name("Jane Developer")
                .email("Jane.Dev@Example.com")
                .password("SecurePass@123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Jane Developer"))
                .andExpect(jsonPath("$.email").value("jane.dev@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.password").doesNotExist());

        // Verify password is encrypted with BCrypt in database
        User saved = userRepository.findByEmailIgnoreCase("jane.dev@example.com").orElseThrow();
        assertThat(saved.getPassword()).isNotEqualTo("SecurePass@123");
        assertThat(passwordEncoder.matches("SecurePass@123", saved.getPassword())).isTrue();
    }

    @Test
    @DisplayName("POST /api/auth/register with duplicate email should return 400 Bad Request")
    void testDuplicateEmailRegistration() throws Exception {
        userRepository.save(User.builder()
                .name("Existing User")
                .email("existing@example.com")
                .password(passwordEncoder.encode("Existing@123"))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        RegisterRequest duplicate = RegisterRequest.builder()
                .name("New User")
                .email("EXISTING@example.com")
                .password("Password@456")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("already exists")));
    }

    @Test
    @DisplayName("POST /api/auth/register with invalid fields should return 400 with validation errors")
    void testInvalidRegistrationFields() throws Exception {
        RegisterRequest invalid = RegisterRequest.builder()
                .name("")
                .email("not-an-email")
                .password("short")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.name").exists())
                .andExpect(jsonPath("$.validationErrors.email").exists())
                .andExpect(jsonPath("$.validationErrors.password").exists());
    }

    @Test
    @DisplayName("POST /api/auth/login with valid credentials should return token and safe user profile")
    void testSuccessfulLogin() throws Exception {
        userRepository.save(User.builder()
                .name("Bob Smith")
                .email("bob@example.com")
                .password(passwordEncoder.encode("MySecret@123"))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        LoginRequest login = LoginRequest.builder()
                .email("BOB@EXAMPLE.COM")
                .password("MySecret@123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.name").value("Bob Smith"))
                .andExpect(jsonPath("$.user.email").value("bob@example.com"))
                .andExpect(jsonPath("$.user.password").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login with invalid password should return 401 with generic error")
    void testLoginInvalidPassword() throws Exception {
        userRepository.save(User.builder()
                .name("Bob Smith")
                .email("bob@example.com")
                .password(passwordEncoder.encode("MySecret@123"))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        LoginRequest login = LoginRequest.builder()
                .email("bob@example.com")
                .password("WrongPassword@999")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    @DisplayName("POST /api/auth/login with unknown email should return 401 with generic error (no enumeration)")
    void testLoginUnknownEmail() throws Exception {
        LoginRequest login = LoginRequest.builder()
                .email("nonexistent@example.com")
                .password("AnyPassword@123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    @DisplayName("Request with invalid or malformed JWT bearer token should return 401 Unauthorized")
    void testInvalidJwtRejected() throws Exception {
        mockMvc.perform(get("/api/users/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer invalid.jwt.token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/users/me should return current authenticated user profile")
    void testGetCurrentUserProfile() throws Exception {
        User user = userRepository.save(User.builder()
                .name("Charlie")
                .email("charlie@example.com")
                .password(passwordEncoder.encode("Password@123"))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        String token = jwtTokenService.generateToken(user);

        mockMvc.perform(get("/api/users/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(user.getId()))
                .andExpect(jsonPath("$.name").value("Charlie"))
                .andExpect(jsonPath("$.email").value("charlie@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("PUT /api/users/me should update user name")
    void testUpdateUserProfile() throws Exception {
        User user = userRepository.save(User.builder()
                .name("Charlie Initial")
                .email("charlie2@example.com")
                .password(passwordEncoder.encode("Password@123"))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        String token = jwtTokenService.generateToken(user);

        UpdateProfileRequest update = UpdateProfileRequest.builder()
                .name("Charlie Updated")
                .build();

        mockMvc.perform(put("/api/users/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Charlie Updated"));

        User refreshed = userRepository.findById(user.getId()).orElseThrow();
        assertThat(refreshed.getName()).isEqualTo("Charlie Updated");
    }

    @Test
    @DisplayName("POST /api/users/me/change-password should succeed with correct old password and fail with wrong old password")
    void testChangePassword() throws Exception {
        User user = userRepository.save(User.builder()
                .name("Dave")
                .email("dave@example.com")
                .password(passwordEncoder.encode("OldPassword@123"))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        String token = jwtTokenService.generateToken(user);

        // 1. Wrong old password
        ChangePasswordRequest wrongOld = ChangePasswordRequest.builder()
                .currentPassword("IncorrectOld@123")
                .newPassword("BrandNewPass@456")
                .build();

        mockMvc.perform(post("/api/users/me/change-password")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongOld)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(containsString("Current password is incorrect")));

        // 2. Correct old password
        ChangePasswordRequest correct = ChangePasswordRequest.builder()
                .currentPassword("OldPassword@123")
                .newPassword("BrandNewPass@456")
                .build();

        mockMvc.perform(post("/api/users/me/change-password")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(correct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(containsString("Password changed successfully")));

        // Verify that the new password works with BCrypt
        User updated = userRepository.findById(user.getId()).orElseThrow();
        assertThat(passwordEncoder.matches("BrandNewPass@456", updated.getPassword())).isTrue();
    }
}
