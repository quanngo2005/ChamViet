package com.vn.chamviet.chamviet_api.contact.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactSubmissionResponse {
    private String type;
    private String recipient;
}
