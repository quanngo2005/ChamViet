package com.vn.chamviet.chamviet_api.product.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductDTO {
    @NotBlank(message = "Product name is required")
    @Size(min = 1, max = 255, message = "Product name must be between 1 and 255 characters")
    private String name;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    @Size(max = 255, message = "Slug must be at most 255 characters")
    private String slug;

    @Size(max = 5000, message = "Description must be at most 5000 characters")
    private String description;

    @Pattern(regexp = "ACTIVE|INACTIVE", message = "Status must be ACTIVE or INACTIVE")
    private String status = "ACTIVE";
}
