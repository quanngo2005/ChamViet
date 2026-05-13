package com.vn.chamviet.chamviet_api.product.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDTO {
    private Long id;
    private String imageUrl;
    private Integer sortOrder;
    private Boolean isPrimary;
}
