package com.vn.chamviet.chamviet_api.user.service;

import com.vn.chamviet.chamviet_api.user.Account;
import com.vn.chamviet.chamviet_api.user.AccountRepo;
import com.vn.chamviet.chamviet_api.user.dto.*;
import com.vn.chamviet.chamviet_api.user.mapper.AccountMapper;
import com.vn.chamviet.chamviet_api.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AccountRepo accountRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;
    private final AccountMapper accountMapper;

    /**
     * Authenticate user and generate JWT tokens
     */
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        try {
            // Authenticate using Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            Account account = accountRepo.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate tokens
            String accessToken = jwtService.generateAccessToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            log.info("Login successful for email: {}", request.getEmail());

            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(3600L) // 1 hour in seconds
                    .account(accountMapper.toDTO(account))
                    .build();

        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail(), e);
            throw new RuntimeException("Invalid email or password");
        }
    }

    /**
     * Refresh access token using refresh token
     */
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refresh token request");
        
        try {
            final String refreshToken = request.getRefreshToken();
            
            // Validate refresh token
            if (!jwtService.isTokenValid(refreshToken, null)) {
                throw new RuntimeException("Invalid or expired refresh token");
            }

            // Extract username from refresh token
            final String username = jwtService.extractUsername(refreshToken);
            
            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            Account account = accountRepo.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate new access token
            String newAccessToken = jwtService.generateAccessToken(userDetails);

            log.info("Refresh token successful for email: {}", username);

            return LoginResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(3600L) // 1 hour in seconds
                    .account(accountMapper.toDTO(account))
                    .build();

        } catch (Exception e) {
            log.error("Refresh token failed", e);
            throw new RuntimeException("Failed to refresh token: " + e.getMessage());
        }
    }

    /**
     * Register new user
     */
    public RegisterResponse register(RegisterRequest request) {
        log.info("Register attempt for email: {}", request.getEmail());
        
        // Check if email already exists
        if (accountRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        try {
            Account account = accountMapper.toEntity(request);
            account.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            
            Account savedAccount = accountRepo.save(account);
            
            log.info("Registration successful for email: {}", request.getEmail());

            return accountMapper.toRegisterResponse(savedAccount);

        } catch (Exception e) {
            log.error("Registration failed for email: {}", request.getEmail(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Logout - typically client-side only, but can be used to invalidate tokens
     */
    public void logout(String token) {
        log.info("Logout request");
        // In a production system, you might want to:
        // 1. Add token to a blacklist
        // 2. Update user's last logout timestamp
        // For now, just log
    }
}
