package com.vn.chamviet.chamviet_api.AI.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    @JsonProperty("message")
    private String message;

    @JsonProperty("session_id")
    private String sessionId;
}
