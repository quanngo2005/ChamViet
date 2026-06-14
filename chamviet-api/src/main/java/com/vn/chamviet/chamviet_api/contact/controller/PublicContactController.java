package com.vn.chamviet.chamviet_api.contact.controller;

import com.vn.chamviet.chamviet_api.contact.dto.ContactRequest;
import com.vn.chamviet.chamviet_api.contact.dto.ContactSubmissionResponse;
import com.vn.chamviet.chamviet_api.contact.service.ContactRequestService;
import com.vn.chamviet.chamviet_api.global.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/contact")
@RequiredArgsConstructor
public class PublicContactController {
    private final ContactRequestService contactRequestService;

    @PostMapping("/requests")
    public ResponseEntity<ApiResponse<ContactSubmissionResponse>> submit(@Valid @RequestBody ContactRequest request) {
        ContactSubmissionResponse response = contactRequestService.submit(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(response, "Contact request submitted", HttpStatus.CREATED.value()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidRequestType(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error("Contact request failed", exception.getMessage(), HttpStatus.BAD_REQUEST.value()));
    }
}
