package com.vn.chamviet.chamviet_api.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ConfusedRequest extends StoryRequest {
    private String question;

    @JsonProperty("correct_answer")
    private String correctAnswer;

    public ConfusedRequest(String storyTitle, int childAge,
                           String question, String correctAnswer) {
        super(storyTitle, childAge);
        this.question = question;
        this.correctAnswer = correctAnswer;
    }
}
