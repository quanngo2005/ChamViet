package com.vn.chamviet.chamviet_api.AI.dto.voice;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerEvalResponse {
    private double score;

    @JsonProperty("is_correct")
    private boolean correct;

    private String feedback;
    private String reason;

    @JsonProperty("embedding_score")
    private Double embeddingScore;

    @JsonProperty("judge_source")
    private String judgeSource;
}
