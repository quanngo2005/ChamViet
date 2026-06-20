package com.vn.chamviet.chamviet_api.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisionStoryResolveDTO {
    private String storySlug;
    private String productRoute;
    private String videoId;
    private Long productId;
    private String componentSku;
}
