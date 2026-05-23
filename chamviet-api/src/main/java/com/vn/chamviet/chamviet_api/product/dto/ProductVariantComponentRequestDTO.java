package com.vn.chamviet.chamviet_api.product.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantComponentRequestDTO {
    @NotNull(message = "Component ID is required")
    private Long componentId;

    @NotNull(message = "Component quantity is required")
    @Positive(message = "Component quantity must be greater than 0")
    private Integer quantity;

    @PositiveOrZero(message = "Sort order must be greater than or equal to 0")
    private Integer sortOrder = 0;
}
