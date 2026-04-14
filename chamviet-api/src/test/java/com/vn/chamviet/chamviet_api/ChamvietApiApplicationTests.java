package com.vn.chamviet.chamviet_api;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.context.annotation.Import;
import com.vn.chamviet.chamviet_api.mail.SmtpEmailService;

@SpringBootTest
@Import(TestMailConfig.class)
class ChamvietApiApplicationTests {

    @Mock
    private JavaMailSender javaMailSender;

    @Mock
    private SmtpEmailService smtpEmailService;

	@Test
	void contextLoads() {
	}

}
