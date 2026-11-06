package com.resumeai.service;

import com.resumeai.dto.*;
import com.resumeai.entity.Role;
import com.resumeai.entity.User;
import com.resumeai.exception.BadRequestException;
import com.resumeai.exception.ResourceNotFoundException;
import com.resumeai.exception.UnauthorizedException;
import com.resumeai.repository.UserRepository;
import com.resumeai.security.JwtTokenProvider;
import com.resumeai.security.UserPrincipal;
import jakarta.annotation.PostConstruct;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostConstruct
    public void initDemoUser() {
        if (!userRepository.existsByEmail("demo@resumeai.com")) {
            User demo = new User(
                    "demo@resumeai.com",
                    passwordEncoder.encode("demo1234"),
                    "Alex",
                    "Morgan"
            );
            demo.setTargetIndustry("Technology");
            demo.setTargetRole("Senior Full-Stack Engineer");
            userRepository.save(demo);
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email is already registered. Please login instead.");
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName().trim(),
                request.getLastName() != null ? request.getLastName().trim() : ""
        );
        user.setRole(Role.ROLE_USER);

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail(), savedUser.getId());

        return new AuthResponse(token, UserResponse.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(authentication);

            User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            return new AuthResponse(token, UserResponse.fromEntity(user));
        } catch (Exception ex) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("User is not authenticated");
        }

        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public void requestPasswordReset(PasswordResetRequest request) {
        // Verify user exists and return confirmation
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with email: " + request.getEmail()));
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with email: " + request.getEmail()));

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

