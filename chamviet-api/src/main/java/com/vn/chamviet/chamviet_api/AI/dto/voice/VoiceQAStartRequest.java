package com.vn.chamviet.chamviet_api.AI.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoiceQAStartRequest {
    @JsonProperty("session_id")
    private String sessionId;

    @JsonProperty("story_title")
    private String storyTitle;

    @JsonProperty("story_content")
    private String storyContent;

    @JsonProperty("child_age")
    private Integer childAge;

    @JsonProperty("qa_list")
    private List<VoiceQAItem> qaList;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoiceQAItem {
        private String question;
        private String answer;
    }
}
