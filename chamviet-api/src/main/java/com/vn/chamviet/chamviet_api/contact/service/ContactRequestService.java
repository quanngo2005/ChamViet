package com.vn.chamviet.chamviet_api.contact.service;

import com.vn.chamviet.chamviet_api.contact.dto.ContactRequest;
import com.vn.chamviet.chamviet_api.contact.dto.ContactRequestType;
import com.vn.chamviet.chamviet_api.contact.dto.ContactSubmissionResponse;
import com.vn.chamviet.chamviet_api.mail.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactRequestService {
    private final EmailService emailService;

    @Value("${app.contact.recipient:motvietnam@chamviet.com.vn}")
    private String recipientEmail;

    public ContactSubmissionResponse submit(ContactRequest request) {
        ContactRequestType requestType = ContactRequestType.fromValue(request.getType());
        emailService.send(recipientEmail, subjectFor(requestType), buildBody(requestType, request));

        return ContactSubmissionResponse.builder()
            .type(request.getType())
            .recipient(recipientEmail)
            .build();
    }

    private String subjectFor(ContactRequestType requestType) {
        return switch (requestType) {
            case INFO_REQUEST -> "ChamViet - Nhận thông tin";
            case PREORDER_REQUEST -> "ChamViet - Đặt trước";
        };
    }

    private String buildBody(ContactRequestType requestType, ContactRequest request) {
        String header = switch (requestType) {
            case INFO_REQUEST -> "Yêu cầu nhận thêm thông tin từ website Chạm Việt.";
            case PREORDER_REQUEST -> "Yêu cầu đặt trước từ trang sản phẩm Chạm Việt.";
        };

        return String.join(
            "\n",
            header,
            "Loại yêu cầu: " + request.getType(),
            "",
            "Họ tên: " + request.getName().trim(),
            "Email: " + request.getEmail().trim(),
            "",
            "Nội dung:",
            request.getMessage().trim()
        );
    }
}
