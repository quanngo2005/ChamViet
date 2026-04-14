package com.vn.chamviet.chamviet_api.AI.dto.voice;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class EndingRequest extends StoryRequest {
    private int score;
    private int total;

    public EndingRequest(String storyTitle, int childAge, int score, int total) {
        super(storyTitle, childAge);
        this.score = score;
        this.total = total;
    }
}
