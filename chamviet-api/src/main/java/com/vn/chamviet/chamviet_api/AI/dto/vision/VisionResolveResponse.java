package com.vn.chamviet.chamviet_api.AI.dto.vision;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisionResolveResponse {
    @JsonProperty("request_id")
    private String requestId;

    @JsonProperty("session_id")
    private String sessionId;

    private String storySlug;

    private String productRoute;

    private String videoId;

    private Boolean fallbackUsed;

    private VisionError error;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VisionError {
        private String code;
        private String message;
    }
}
