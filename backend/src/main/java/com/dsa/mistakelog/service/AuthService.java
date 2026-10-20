package com.dsa.mistakelog.service;

import com.dsa.mistakelog.dto.AuthResponse;
import com.dsa.mistakelog.dto.LoginRequest;
import com.dsa.mistakelog.dto.RegisterRequest;
import com.dsa.mistakelog.dto.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
