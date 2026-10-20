package com.dsa.mistakelog.controller;

import com.dsa.mistakelog.config.CurrentUserResolver;
import com.dsa.mistakelog.dto.ChangePasswordRequest;
import com.dsa.mistakelog.dto.UpdateProfileRequest;
import com.dsa.mistakelog.dto.UserResponse;
import com.dsa.mistakelog.entity.User;
import com.dsa.mistakelog.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CurrentUserResolver currentUserResolver;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User currentUser = currentUserResolver.resolveCurrentUser();
        UserResponse response = userService.getProfile(currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(@Valid @RequestBody UpdateProfileRequest request) {
        User currentUser = currentUserResolver.resolveCurrentUser();
        UserResponse response = userService.updateProfile(currentUser, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User currentUser = currentUserResolver.resolveCurrentUser();
        userService.changePassword(currentUser, request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
