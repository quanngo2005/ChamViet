package com.vn.chamviet.chamviet_api.product.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComponentDTO {
    private Long id;
    private String sku;
    private String name;
    private String componentType;
    private Integer ageRangeId;
    private String ageRangeName;
    private String videoUrl;
    private String storyTitle;
    private Integer pieceCount;
    private Integer stockOnHand;
    private Integer reservedStock;
    private String status;
}
