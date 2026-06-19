package com.vn.chamviet.chamviet_api.AI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiResponseDTO {
    private String status;
    private String message;
    private List<PredictionData> data;
    private Long productId;
    private Long variantId;
    private Long componentId;
    private String componentSku;
    private String route;
    private String videoId;
    private String videoUrl;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PredictionData {
        private String label;
        private Double confidence;
        private List<List<Double>> box; // Tọa độ khung nhận diện [x1, y1, x2, y2]
    }
}
