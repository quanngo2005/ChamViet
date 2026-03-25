package com.vn.chamviet.chamviet_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiResponseDTO {
    private String status;
    private List<PredictionData> data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PredictionData {
        private String label;
        private Double confidence;
        private List<List<Double>> box; // Tọa độ khung nhận diện [x1, y1, x2, y2]
    }
}