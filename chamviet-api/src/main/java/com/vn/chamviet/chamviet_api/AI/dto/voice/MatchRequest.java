package com.vn.chamviet.chamviet_api.AI.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchRequest {
    @JsonProperty("user_text")
    private String userText;

    @JsonProperty("correct_answer")
    private String correctAnswer;
}
