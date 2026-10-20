package com.dsa.mistakelog.service;

import com.dsa.mistakelog.dto.ChangePasswordRequest;
import com.dsa.mistakelog.dto.UpdateProfileRequest;
import com.dsa.mistakelog.dto.UserResponse;
import com.dsa.mistakelog.entity.User;

public interface UserService {

    UserResponse getProfile(User currentUser);

    UserResponse updateProfile(User currentUser, UpdateProfileRequest request);

    void changePassword(User currentUser, ChangePasswordRequest request);
}
