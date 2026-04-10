package com.vn.chamviet.chamviet_api.user.controller;

import com.vn.chamviet.chamviet_api.user.dto.*;
import com.vn.chamviet.chamviet_api.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Login endpoint
     * @param loginRequest email and password
     * @return LoginResponse with access token, refresh token, and user info
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login request for email: {}", loginRequest.getEmail());
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Login successful", HttpStatus.OK.value())
            );
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Login failed", e.getMessage(), HttpStatus.UNAUTHORIZED.value()));
        }
    }

    /**
     * Refresh token endpoint
     * @param request contains refresh token
     * @return LoginResponse with new access token
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            log.info("Refresh token request");
            LoginResponse response = authService.refreshToken(request);
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Token refreshed successfully", HttpStatus.OK.value())
            );
        } catch (Exception e) {
            log.error("Refresh token error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Refresh token failed", e.getMessage(), HttpStatus.UNAUTHORIZED.value()));
        }
    }

    /**
     * Register endpoint
     * @param registerRequest email, password, fullName, phone, roleId
     * @return RegisterResponse with new user info
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            log.info("Register request for email: {}", registerRequest.getEmail());
            RegisterResponse response = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(response, "Registration successful", HttpStatus.CREATED.value()));
        } catch (Exception e) {
            log.error("Registration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Registration failed", e.getMessage(), HttpStatus.BAD_REQUEST.value()));
        }
    }

    /**
     * Logout endpoint
     * @param authHeader Authorization header with Bearer token
     * @return Success message
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            log.info("Logout request");
            
            String token = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
            
            authService.logout(token);
            
            return ResponseEntity.ok(
                    ApiResponse.success(null, "Logout successful", HttpStatus.OK.value())
            );
        } catch (Exception e) {
            log.error("Logout error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Logout failed", e.getMessage(), HttpStatus.BAD_REQUEST.value()));
        }
    }

    /**
     * Health check endpoint
     * @return OK status
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(
                ApiResponse.success("Auth service is running", "OK", HttpStatus.OK.value())
        );
    }
}
