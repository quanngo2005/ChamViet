package com.vn.chamviet.chamviet_api.product.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantComponentDTO {
    private Long id;
    private Long componentId;
    private String componentSku;
    private String componentName;
    private String componentType;
    private Integer quantity;
    private Integer sortOrder;
    private String videoUrl;
    private String storyTitle;
    private Integer pieceCount;
}
