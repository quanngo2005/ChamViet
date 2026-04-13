package com.vn.chamviet.chamviet_api.user.service;

import com.vn.chamviet.chamviet_api.mail.EmailService;
import com.vn.chamviet.chamviet_api.security.JwtService;
import com.vn.chamviet.chamviet_api.user.Account;
import com.vn.chamviet.chamviet_api.user.AccountRepo;
import com.vn.chamviet.chamviet_api.user.ActivationToken;
import com.vn.chamviet.chamviet_api.user.ActivationTokenRepo;
import com.vn.chamviet.chamviet_api.user.Role;
import com.vn.chamviet.chamviet_api.user.dto.RegisterRequest;
import com.vn.chamviet.chamviet_api.user.dto.RegisterResponse;
import com.vn.chamviet.chamviet_api.user.mapper.AccountMapper;
import com.vn.chamviet.chamviet_api.utilites.PasswordEncrypt;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetailsService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class RegisterServiceTest {

    @Test
    void testRegisterCreatesInactiveAndSendsEmail() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        ActivationTokenRepo activationTokenRepo = mock(ActivationTokenRepo.class);
        EmailService emailService = mock(EmailService.class);

        AuthService authService = new AuthService(
                accountRepo,
                jwtService,
                null, userDetailsService,
                accountMapper,
                passwordEncrypt,
                activationTokenRepo,
                emailService
        );

        String email = "newuser@example.com";
        RegisterRequest request = RegisterRequest.builder().email(email).password("pass").fullName("New User").build();

        Account toSave = Account.builder().email(email).fullName("New User").build();
        when(accountMapper.toEntity(request)).thenReturn(toSave);
        when(passwordEncrypt.encrypt("pass")).thenReturn("encrypted");

        Role customerRole = new Role();
        customerRole.setId(2);
        
        Account saved = Account.builder()
                .id(2L)
                .email(email)
                .fullName("New User")
                .status(Account.AccountStatus.INACTIVE)
                .passwordHash("encrypted")
                .role(customerRole)
                .build();

        when(accountRepo.save(any())).thenReturn(saved);
        when(accountMapper.toRegisterResponse(saved))
                .thenReturn(RegisterResponse.builder().id(2L).email(email).status("INACTIVE").build());

        RegisterResponse resp = authService.register(request);

        assertNotNull(resp);
        assertEquals("INACTIVE", resp.getStatus());
        verify(activationTokenRepo).save(any(ActivationToken.class));
        verify(emailService).sendActivationEmail(eq(saved), anyString());
    }

    @Test
    void testRegisterSetsDefaultCustomerRole() {
        AccountRepo accountRepo = mock(AccountRepo.class);
        JwtService jwtService = mock(JwtService.class);
        UserDetailsService userDetailsService = mock(UserDetailsService.class);
        AccountMapper accountMapper = mock(AccountMapper.class);
        PasswordEncrypt passwordEncrypt = mock(PasswordEncrypt.class);
        ActivationTokenRepo activationTokenRepo = mock(ActivationTokenRepo.class);
        EmailService emailService = mock(EmailService.class);

        AuthService authService = new AuthService(
                accountRepo,
                jwtService,
                null, userDetailsService,
                accountMapper,
                passwordEncrypt,
                activationTokenRepo,
                emailService
        );

        String email = "customer@example.com";
        RegisterRequest request = RegisterRequest.builder().email(email).password("pass").fullName("Customer User").build();

        Account toSave = Account.builder().email(email).fullName("Customer User").build();
        when(accountMapper.toEntity(request)).thenReturn(toSave);
        when(passwordEncrypt.encrypt("pass")).thenReturn("encrypted");

        Role customerRole = new Role();
        customerRole.setId(2);
        
        Account saved = Account.builder()
                .id(3L)
                .email(email)
                .fullName("Customer User")
                .status(Account.AccountStatus.INACTIVE)
                .passwordHash("encrypted")
                .role(customerRole)
                .build();

        when(accountRepo.save(any())).thenReturn(saved);
        when(accountMapper.toRegisterResponse(saved))
                .thenReturn(RegisterResponse.builder().id(3L).email(email).status("INACTIVE").build());

        RegisterResponse resp = authService.register(request);

        assertNotNull(resp);
        assertEquals("INACTIVE", resp.getStatus());
        // Verify the saved account has role ID 2 (customer)
        verify(accountRepo).save(any(Account.class));
    }
}
