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
public class AfterExplainRequest extends StoryRequest {
    @JsonProperty("original_question")
    private String originalQuestion;

    public AfterExplainRequest(int childAge, String originalQuestion) {
        super(null, childAge);
        this.originalQuestion = originalQuestion;
    }
}
