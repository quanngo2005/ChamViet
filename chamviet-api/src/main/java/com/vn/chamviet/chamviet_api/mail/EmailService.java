package com.vn.chamviet.chamviet_api.mail;

import com.vn.chamviet.chamviet_api.user.Account;

public interface EmailService {
    void send(String to, String subject, String body);
    void sendActivationEmail(Account account, String token);
}