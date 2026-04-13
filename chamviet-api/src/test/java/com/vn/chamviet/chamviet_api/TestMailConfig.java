package com.vn.chamviet.chamviet_api;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.SimpleMailMessage;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

@Configuration
public class TestMailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        return new JavaMailSenderImpl() {
            @Override
            public void send(SimpleMailMessage... simpleMessages) {
                // no-op for tests
            }

            @Override
            public void send(MimeMessage... mimeMessages) {
                // no-op for tests
            }

            @Override
            public MimeMessage createMimeMessage() {
                return new MimeMessage(Session.getDefaultInstance(new Properties()));
            }
        };
    }
}
