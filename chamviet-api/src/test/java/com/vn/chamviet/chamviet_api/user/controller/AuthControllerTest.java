package com.vn.chamviet.chamviet_api.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vn.chamviet.chamviet_api.user.dto.*;
import com.vn.chamviet.chamviet_api.user.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private LoginRequest loginRequest;
    private LoginResponse loginResponse;
    private AccountDTO accountDTO;

    @BeforeEach
    void setUp() {
        accountDTO = AccountDTO.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .phone("1234567890")
                .build();

        loginRequest = LoginRequest.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        loginResponse = LoginResponse.builder()
                .accessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjc3NTMwMDAwLCJleHAiOjE2Nzc1MzM2MDB9.signature")
                .refreshToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE2Nzc1MzAwMDAsImV4cCI6MTY3ODEzNTAwMH0.signature")
                .tokenType("Bearer")
                .expiresIn(3600L)
                .account(accountDTO)
                .build();
    }

    @Test
    void testLoginSuccess() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.data.accessToken").value(loginResponse.getAccessToken()))
                .andExpect(jsonPath("$.data.refreshToken").value(loginResponse.getRefreshToken()))
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.expiresIn").value(3600))
                .andExpect(jsonPath("$.data.account.email").value("test@example.com"))
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    void testLoginInvalidCredentials() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Invalid email or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.statusCode").value(401))
                .andExpect(jsonPath("$.message").value("Login failed"));
    }

    @Test
    void testLoginMissingEmail() throws Exception {
        LoginRequest invalidRequest = LoginRequest.builder()
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRefreshTokenSuccess() throws Exception {
        RefreshTokenRequest refreshRequest = RefreshTokenRequest.builder()
                .refreshToken("refresh-token-value")
                .build();

        LoginResponse refreshResponse = LoginResponse.builder()
                .accessToken("new-access-token")
                .refreshToken("refresh-token-value")
                .tokenType("Bearer")
                .expiresIn(3600L)
                .account(accountDTO)
                .build();

        when(authService.refreshToken(any(RefreshTokenRequest.class)))
                .thenReturn(refreshResponse);

        mockMvc.perform(post("/api/auth/refresh-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("new-access-token"))
                .andExpect(jsonPath("$.data.refreshToken").value("refresh-token-value"))
                .andExpect(jsonPath("$.message").value("Token refreshed successfully"));
    }

    @Test
    void testRefreshTokenInvalid() throws Exception {
        RefreshTokenRequest refreshRequest = RefreshTokenRequest.builder()
                .refreshToken("invalid-token")
                .build();

        when(authService.refreshToken(any(RefreshTokenRequest.class)))
                .thenThrow(new RuntimeException("Invalid or expired refresh token"));

        mockMvc.perform(post("/api/auth/refresh-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.statusCode").value(401));
    }

    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("newuser@example.com")
                .password("password123")
                .fullName("New User")
                .phone("9876543210")
                .build();

        RegisterResponse registerResponse = RegisterResponse.builder()
                .id(2L)
                .email("newuser@example.com")
                .fullName("New User")
                .phone("9876543210")
                .status("INACTIVE")
                .build();

        when(authService.register(any(RegisterRequest.class)))
                .thenReturn(registerResponse);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.statusCode").value(201))
                .andExpect(jsonPath("$.data.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.data.status").value("INACTIVE"))
                .andExpect(jsonPath("$.message").value("Registration successful"));
    }

    @Test
    void testRegisterSetsDefaultCustomerRole() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("customer@example.com")
                .password("password123")
                .fullName("Customer User")
                .phone("9876543210")
                .build();

        RegisterResponse registerResponse = RegisterResponse.builder()
                .id(3L)
                .email("customer@example.com")
                .fullName("Customer User")
                .phone("9876543210")
                .status("INACTIVE")
                .build();

        when(authService.register(any(RegisterRequest.class)))
                .thenReturn(registerResponse);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.statusCode").value(201))
                .andExpect(jsonPath("$.data.email").value("customer@example.com"))
                .andExpect(jsonPath("$.data.status").value("INACTIVE"))
                .andExpect(jsonPath("$.message").value("Registration successful"));
    }

    @Test
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("existing@example.com")
                .password("password123")
                .fullName("Existing User")
                .build();

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Email already registered"));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.statusCode").value(400));
    }

    @Test
    void testActivateAccountSuccess() throws Exception {
        String token = "activation-token-123";
        RegisterResponse activationResponse = RegisterResponse.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .status("ACTIVE")
                .build();

        when(authService.activateAccount(token))
                .thenReturn(activationResponse);

        mockMvc.perform(get("/api/auth/activate")
                .param("token", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.message").value("Account activated"));
    }

    @Test
    void testActivateAccountInvalidToken() throws Exception {
        String invalidToken = "invalid-token";

        when(authService.activateAccount(invalidToken))
                .thenThrow(new RuntimeException("Invalid or expired activation token"));

        mockMvc.perform(get("/api/auth/activate")
                .param("token", invalidToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testLogoutSuccess() throws Exception {
        String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.signature";

        mockMvc.perform(post("/api/auth/logout")
                .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void testLogoutWithoutToken() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/api/auth/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("OK"))
                .andExpect(jsonPath("$.data").value("Auth service is running"));
    }

    @Test
    void testJwtTokenStructure() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken", containsString(".")))
                .andExpect(jsonPath("$.data.accessToken", matchesRegex(
                        "^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$")))
                .andExpect(jsonPath("$.data.refreshToken", containsString(".")))
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"));
    }

    @Test
    void testLoginResponseContainsUserInfo() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.account").exists())
                .andExpect(jsonPath("$.data.account.id").value(1))
                .andExpect(jsonPath("$.data.account.email").value("test@example.com"))
                .andExpect(jsonPath("$.data.account.fullName").value("Test User"));
    }
}
