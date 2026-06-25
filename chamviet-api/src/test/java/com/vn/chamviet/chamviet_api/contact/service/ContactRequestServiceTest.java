package com.vn.chamviet.chamviet_api.contact.service;

import com.vn.chamviet.chamviet_api.contact.dto.ContactRequest;
import com.vn.chamviet.chamviet_api.contact.dto.ContactSubmissionResponse;
import com.vn.chamviet.chamviet_api.mail.EmailService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class ContactRequestServiceTest {

    @Test
    void submitInfoRequestSendsInformationEmail() {
        EmailService emailService = mock(EmailService.class);
        ContactRequestService service = new ContactRequestService(emailService);
        ReflectionTestUtils.setField(service, "recipientEmail", "motvietnam@chamviet.com.vn");

        ContactRequest request = ContactRequest.builder()
            .name("Nguyen Van A")
            .email("parent@example.com")
            .message("Cho mình xin thêm thông tin về sản phẩm.")
            .type("info_request")
            .build();

        ContactSubmissionResponse response = service.submit(request);

        assertEquals("info_request", response.getType());
        assertEquals("motvietnam@chamviet.com.vn", response.getRecipient());

        ArgumentCaptor<String> bodyCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).send(
            eq("motvietnam@chamviet.com.vn"),
            eq("ChamViet - Nhận thông tin"),
            bodyCaptor.capture()
        );
        String body = bodyCaptor.getValue();
        assertTrue(body.contains("Loại yêu cầu: info_request"));
        assertTrue(body.contains("Họ tên: Nguyen Van A"));
        assertTrue(body.contains("Email: parent@example.com"));
        assertTrue(body.contains("Cho mình xin thêm thông tin về sản phẩm."));
    }

    @Test
    void submitPreorderRequestSendsPreorderEmail() {
        EmailService emailService = mock(EmailService.class);
        ContactRequestService service = new ContactRequestService(emailService);
        ReflectionTestUtils.setField(service, "recipientEmail", "motvietnam@chamviet.com.vn");

        ContactRequest request = ContactRequest.builder()
            .name("Tran Thi B")
            .email("buyer@example.com")
            .message("Mình muốn đặt trước một bộ.")
            .type("preorder_request")
            .build();

        service.submit(request);

        ArgumentCaptor<String> bodyCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).send(
            eq("motvietnam@chamviet.com.vn"),
            eq("ChamViet - Đặt trước"),
            bodyCaptor.capture()
        );
        String body = bodyCaptor.getValue();
        assertTrue(body.contains("Loại yêu cầu: preorder_request"));
        assertTrue(body.contains("Họ tên: Tran Thi B"));
        assertTrue(body.contains("Email: buyer@example.com"));
        assertTrue(body.contains("Mình muốn đặt trước một bộ."));
    }

    @Test
    void submitRejectsUnknownRequestType() {
        EmailService emailService = mock(EmailService.class);
        ContactRequestService service = new ContactRequestService(emailService);

        ContactRequest request = ContactRequest.builder()
            .name("Tran Thi B")
            .email("buyer@example.com")
            .message("Mình muốn đặt trước một bộ.")
            .type("unknown")
            .build();

        assertThrows(IllegalArgumentException.class, () -> service.submit(request));
    }
}
