package com.vn.chamviet.chamviet_api.product.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductImageDTO {
    @NotBlank(message = "Image URL is required")
    @Size(max = 500, message = "Image URL must be at most 500 characters")
    private String imageUrl;

    @PositiveOrZero(message = "Sort order must be greater than or equal to 0")
    private Integer sortOrder = 0;

    private Boolean isPrimary = false;
}
