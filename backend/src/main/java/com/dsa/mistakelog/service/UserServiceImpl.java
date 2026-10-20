package com.dsa.mistakelog.service;

import com.dsa.mistakelog.dto.ChangePasswordRequest;
import com.dsa.mistakelog.dto.UpdateProfileRequest;
import com.dsa.mistakelog.dto.UserResponse;
import com.dsa.mistakelog.entity.User;
import com.dsa.mistakelog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getProfile(User currentUser) {
        return UserResponse.fromEntity(currentUser);
    }

    @Override
    public UserResponse updateProfile(User currentUser, UpdateProfileRequest request) {
        currentUser.setName(request.getName().trim());
        User saved = userRepository.save(currentUser);
        log.info("Updated profile for user email: {}", saved.getEmail());
        return UserResponse.fromEntity(saved);
    }

    @Override
    public void changePassword(User currentUser, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
        log.info("Password successfully changed for user email: {}", currentUser.getEmail());
    }
}
