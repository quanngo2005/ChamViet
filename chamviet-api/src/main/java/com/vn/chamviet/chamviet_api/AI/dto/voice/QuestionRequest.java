package com.vn.chamviet.chamviet_api.AI.dto.voice;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class QuestionRequest extends StoryRequest {
    private String question;

    public QuestionRequest(String storyTitle, int childAge, String question) {
        super(storyTitle, childAge);
        this.question = question;
    }
}
