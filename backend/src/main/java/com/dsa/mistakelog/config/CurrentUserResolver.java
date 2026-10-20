package com.dsa.mistakelog.config;

import com.dsa.mistakelog.entity.User;
import com.dsa.mistakelog.exception.ResourceNotFoundException;
import com.dsa.mistakelog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserResolver {

    private final UserRepository userRepository;

    public User resolveCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return resolveUser(authentication);
    }

    public User resolveUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AuthenticationCredentialsNotFoundException("Full authentication is required to access this resource");
        }

        String email;
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            email = jwt.getSubject();
        } else {
            email = authentication.getName();
        }

        if (email == null || email.isBlank()) {
            throw new AuthenticationCredentialsNotFoundException("Principal does not contain a valid email address");
        }

        return userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
