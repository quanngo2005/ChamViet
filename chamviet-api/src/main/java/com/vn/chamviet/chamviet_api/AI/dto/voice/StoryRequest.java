package com.vn.chamviet.chamviet_api.AI.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoryRequest {
    @JsonProperty("story_title")
    private String storyTitle;

    @JsonProperty("child_age")
    private int childAge;
}
