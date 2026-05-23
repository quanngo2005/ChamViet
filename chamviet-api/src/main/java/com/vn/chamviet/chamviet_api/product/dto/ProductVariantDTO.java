package com.vn.chamviet.chamviet_api.product.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantDTO {
    private Long id;
    private String sku;
    private BigDecimal price;
    private Integer ageRangeId;
    private String ageRangeName;
    private Object attributes;
    private List<ProductVariantComponentDTO> components;
}
