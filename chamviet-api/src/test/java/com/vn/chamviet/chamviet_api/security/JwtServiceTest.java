package com.vn.chamviet.chamviet_api.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        String secret = "0123456789ABCDEFGHIJKLMNOPQRSTUVWX0123456789ABCDEFGHIJKLMNOP";
        ReflectionTestUtils.setField(jwtService, "secretKey", secret);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 3600_000L);
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiration", 7 * 24 * 3600_000L);
    }

    @Test
    void testGenerateAccessToken() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateAccessToken(user);

        assertNotNull(token);
        assertTrue(token.contains("."));
        assertEquals(3, token.split("\\.").length);
    }

    @Test
    void testGenerateAndValidateAccessToken() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateAccessToken(user);
        assertNotNull(token);
        assertEquals("test@example.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, user));
    }

    @Test
    void testGenerateRefreshToken() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String refreshToken = jwtService.generateRefreshToken(user);

        assertNotNull(refreshToken);
        assertTrue(refreshToken.contains("."));
        assertEquals(3, refreshToken.split("\\.").length);
    }

    @Test
    void testGenerateAndValidateRefreshToken() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String refresh = jwtService.generateRefreshToken(user);
        assertNotNull(refresh);

        String type = jwtService.extractClaim(refresh, c -> c.get("type", String.class));
        assertEquals("refresh", type);

        assertTrue(jwtService.isTokenValid(refresh));
    }

    @Test
    void testRefreshTokenHasRefreshType() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String refreshToken = jwtService.generateRefreshToken(user);
        String type = jwtService.extractClaim(refreshToken, claims -> claims.get("type", String.class));

        assertEquals("refresh", type);
    }

    @Test
    void testAccessTokenDoesNotHaveRefreshType() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String accessToken = jwtService.generateAccessToken(user);
        String type = jwtService.extractClaim(accessToken, claims -> claims.get("type", String.class));

        assertNull(type);
    }

    @Test
    void testExtractUsernameFromToken() {
        UserDetails user = User.withUsername("john.doe@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateAccessToken(user);
        String username = jwtService.extractUsername(token);

        assertEquals("john.doe@example.com", username);
    }

    @Test
    void testExtractExpirationDate() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateAccessToken(user);
        Date expiration = jwtService.extractExpiration(token);

        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    void testTokenExpirationValidation() {
        jwtService = new JwtService();
        String secret = "0123456789ABCDEFGHIJKLMNOPQRSTUVWX0123456789ABCDEFGHIJKLMNOP";
        ReflectionTestUtils.setField(jwtService, "secretKey", secret);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 1L);
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiration", 1L);

        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String expiredToken = jwtService.generateAccessToken(user);

        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        assertTrue(jwtService.isTokenExpired(expiredToken));
    }

    @Test
    void testTokenValidationWithDifferentUser() {
        UserDetails user1 = User.withUsername("user1@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        UserDetails user2 = User.withUsername("user2@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateAccessToken(user1);

        assertFalse(jwtService.isTokenValid(token, user2));
        assertTrue(jwtService.isTokenValid(token, user1));
    }

    @Test
    void testTokenWithoutUserDetails() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateAccessToken(user);

        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    void testInvalidTokenValidation() {
        String invalidToken = "invalid.token.here";

        assertFalse(jwtService.isTokenValid(invalidToken));
    }

    @Test
    void testJwtTokenClaims() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtService.generateAccessToken(user);

        String subject = jwtService.extractClaim(token, Claims::getSubject);
        Date issuedAt = jwtService.extractClaim(token, Claims::getIssuedAt);
        Date expiration = jwtService.extractClaim(token, Claims::getExpiration);

        assertEquals("test@example.com", subject);
        assertNotNull(issuedAt);
        assertNotNull(expiration);
        assertTrue(expiration.after(issuedAt));
    }

    @Test
    void testAccessAndRefreshTokenDifferent() {
        UserDetails user = User.withUsername("test@example.com")
                .password("pass")
                .authorities(Collections.emptyList())
                .build();

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        assertNotEquals(accessToken, refreshToken);
    }
}
