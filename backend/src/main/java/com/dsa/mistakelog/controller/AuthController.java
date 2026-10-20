package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.dto.AuthResponse;
import com.dsa.mistakelog.dto.LoginRequest;
import com.dsa.mistakelog.dto.RegisterRequest;
import com.dsa.mistakelog.dto.UserResponse;
import com.dsa.mistakelog.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService mistakeAuthService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = mistakeAuthService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = mistakeAuthService.login(request);
        return ResponseEntity.ok(response);
    }
}
