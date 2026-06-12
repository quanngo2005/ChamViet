package com.vn.chamviet.chamviet_api.product.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductVariantDTO {
    @NotBlank(message = "SKU is required")
    @Size(max = 100, message = "SKU must be at most 100 characters")
    private String sku;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Component count is required")
    @Positive(message = "Component count must be greater than 0")
    private Integer componentCount;

    private Object attributes;

    @NotEmpty(message = "Variant components are required")
    private List<ProductVariantComponentRequestDTO> components;
}
