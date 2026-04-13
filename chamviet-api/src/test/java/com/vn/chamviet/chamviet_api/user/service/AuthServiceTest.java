package com.vn.chamviet.chamviet_api.user.service;

import com.vn.chamviet.chamviet_api.mail.EmailService;
import com.vn.chamviet.chamviet_api.security.JwtService;
import com.vn.chamviet.chamviet_api.user.Account;
import com.vn.chamviet.chamviet_api.user.AccountRepo;
import com.vn.chamviet.chamviet_api.user.ActivationTokenRepo;
import com.vn.chamviet.chamviet_api.user.dto.AccountDTO;
import com.vn.chamviet.chamviet_api.user.dto.LoginRequest;
import com.vn.chamviet.chamviet_api.user.dto.LoginResponse;
import com.vn.chamviet.chamviet_api.user.dto.RefreshTokenRequest;
import com.vn.chamviet.chamviet_api.user.mapper.AccountMapper;
import com.vn.chamviet.chamviet_api.utilites.PasswordEncrypt;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class AuthServiceTest {

    private AuthService buildService(AccountRepo accountRepo,
                                     JwtService jwtService,
                                     UserDetailsService userDetailsService,
                                     AccountMapper accountMapper,
                                     PasswordEncrypt passwordEncrypt) {
        ActivationTokenRepo activationTokenRepo = mock(ActivationTokenRepo.class);
        EmailService emailService = mock(EmailService.class);
        return new AuthService(
                accountRepo,
                jwtService,
                null, userDetailsService,
                accountMapper,
                passwordEncrypt,
                activationTokenRepo,
                emailService
        );
    }

    @Test
    void testLoginSuccess() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        AuthService authService = buildService(accountRepo, jwtService, userDetailsService, accountMapper, passwordEncrypt);

        String email = "test@example.com";
        String password = "password";

        LoginRequest request = LoginRequest.builder().email(email).password(password).build();

        UserDetails userDetails = User.withUsername(email)
                .password("encrypted")
                .authorities(Collections.emptyList())
                .build();

        Account account = Account.builder()
                .id(1L)
                .email(email)
                .fullName("Test User")
                .status(Account.AccountStatus.ACTIVE)
                .passwordHash("encrypted")
                .build();

        when(accountRepo.findByEmail(email)).thenReturn(Optional.of(account));
        when(passwordEncrypt.decrypt("encrypted")).thenReturn(password);
        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(jwtService.generateAccessToken(userDetails)).thenReturn("access-token");
        when(jwtService.generateRefreshToken(userDetails)).thenReturn("refresh-token");

        AccountDTO dto = AccountDTO.builder().id(1L).email(email).fullName("Test User").build();
        when(accountMapper.toDTO(account)).thenReturn(dto);

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(dto, response.getAccount());
        assertEquals(3600L, response.getExpiresIn());
    }

    @Test
    void testLoginInvalidCredentials() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        AuthService authService = buildService(accountRepo, jwtService, userDetailsService, accountMapper, passwordEncrypt);

        LoginRequest request = LoginRequest.builder()
                .email("wrong@example.com")
                .password("wrong-password")
                .build();

        Account account = Account.builder()
                .email("wrong@example.com")
                .passwordHash("encrypted")
                .status(Account.AccountStatus.ACTIVE)
                .build();

        when(accountRepo.findByEmail("wrong@example.com")).thenReturn(Optional.of(account));
        when(passwordEncrypt.decrypt("encrypted")).thenReturn("actual-password");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Invalid email or password", ex.getMessage());
    }

    @Test
    void testLoginUserNotFound() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        AuthService authService = buildService(accountRepo, jwtService, userDetailsService, accountMapper, passwordEncrypt);

        LoginRequest request = LoginRequest.builder()
                .email("nonexistent@example.com")
                .password("password")
                .build();

        when(accountRepo.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void testLoginInactiveAccount() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        AuthService authService = buildService(accountRepo, jwtService, userDetailsService, accountMapper, passwordEncrypt);

        LoginRequest request = LoginRequest.builder()
                .email("test@example.com")
                .password("password")
                .build();

        Account account = Account.builder()
                .email("test@example.com")
                .passwordHash("encrypted")
                .status(Account.AccountStatus.INACTIVE)
                .build();

        when(accountRepo.findByEmail("test@example.com")).thenReturn(Optional.of(account));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Account is not active. Please activate your account.", ex.getMessage());
    }

    @Test
    void testLoginEmptyEmail() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        AuthService authService = buildService(accountRepo, jwtService, userDetailsService, accountMapper, passwordEncrypt);

        LoginRequest request = LoginRequest.builder()
                .email("")
                .password("password")
                .build();

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Email is required", ex.getMessage());
    }

    @Test
    void testLoginEmptyPassword() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        AuthService authService = buildService(accountRepo, jwtService, userDetailsService, accountMapper, passwordEncrypt);

        LoginRequest request = LoginRequest.builder()
                .email("test@example.com")
                .password("")
                .build();

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Password is required", ex.getMessage());
    }

    @Test
    void testRefreshTokenSuccess() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        AuthService authService = buildService(accountRepo, jwtService, userDetailsService, accountMapper, passwordEncrypt);

        String email = "test@example.com";
        String refreshToken = "refresh-token";

        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken(refreshToken)
                .build();

        UserDetails userDetails = User.withUsername(email)
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        Account account = Account.builder().id(1L).email(email).fullName("Test User").status(Account.AccountStatus.ACTIVE).build();
        AccountDTO dto = AccountDTO.builder().id(1L).email(email).fullName("Test User").build();

        when(jwtService.isTokenValid(refreshToken)).thenReturn(true);
        when(jwtService.extractUsername(refreshToken)).thenReturn(email);
        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(accountRepo.findByEmail(email)).thenReturn(Optional.of(account));
        when(jwtService.generateAccessToken(userDetails)).thenReturn("new-access-token");
        when(accountMapper.toDTO(account)).thenReturn(dto);

        LoginResponse response = authService.refreshToken(request);

        assertNotNull(response);
        assertEquals("new-access-token", response.getAccessToken());
        assertEquals(refreshToken, response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(3600L, response.getExpiresIn());
        assertEquals(dto, response.getAccount());
        verify(jwtService).isTokenValid(refreshToken);
    }

    @Test
    void testRefreshTokenInvalid() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        AuthService authService = buildService(accountRepo, jwtService, userDetailsService, accountMapper, passwordEncrypt);

        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken("invalid-refresh-token")
                .build();

        when(jwtService.isTokenValid("invalid-refresh-token")).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.refreshToken(request));
        assertEquals("Invalid or expired refresh token", ex.getMessage());
    }
}
