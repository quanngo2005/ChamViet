package com.vn.chamviet.chamviet_api.product.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String status;
    private CategoryDTO category;
    private List<ProductImageDTO> images;
    private List<ProductVariantDTO> variants;
}
