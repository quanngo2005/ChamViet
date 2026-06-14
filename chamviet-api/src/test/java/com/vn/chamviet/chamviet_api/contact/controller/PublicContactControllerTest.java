package com.vn.chamviet.chamviet_api.contact.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vn.chamviet.chamviet_api.contact.dto.ContactRequest;
import com.vn.chamviet.chamviet_api.contact.dto.ContactSubmissionResponse;
import com.vn.chamviet.chamviet_api.contact.service.ContactRequestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class PublicContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContactRequestService contactRequestService;

    @Test
    void submitReturnsCreatedResponse() throws Exception {
        ContactRequest request = ContactRequest.builder()
            .name("Nguyen Van A")
            .email("parent@example.com")
            .message("Cho mình xin thêm thông tin.")
            .type("info_request")
            .build();

        when(contactRequestService.submit(any(ContactRequest.class)))
            .thenReturn(ContactSubmissionResponse.builder()
                .type("info_request")
                .recipient("motvietnam@chamviet.com.vn")
                .build());

        mockMvc.perform(post("/api/public/contact/requests")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.type").value("info_request"))
            .andExpect(jsonPath("$.data.recipient").value("motvietnam@chamviet.com.vn"));
    }
}
