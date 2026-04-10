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
public class ExplainRequest extends StoryRequest {
    @JsonProperty("child_question")
    private String childQuestion;

    public ExplainRequest(String storyTitle, int childAge, String childQuestion) {
        super(storyTitle, childAge);
        this.childQuestion = childQuestion;
    }
}
