package com.vn.chamviet.chamviet_api.AI.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AnswerEvalRequest extends StoryRequest {
    private String question;

    @JsonProperty("child_answer")
    private String childAnswer;

    @JsonProperty("correct_answer")
    private String correctAnswer;

    public AnswerEvalRequest(String storyTitle, int childAge,
                             String question, String childAnswer, String correctAnswer) {
        super(storyTitle, childAge);
        this.question = question;
        this.childAnswer = childAnswer;
        this.correctAnswer = correctAnswer;
    }
}
