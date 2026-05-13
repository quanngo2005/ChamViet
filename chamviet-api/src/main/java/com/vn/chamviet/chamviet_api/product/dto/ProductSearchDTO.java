package com.vn.chamviet.chamviet_api.product.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchDTO {
    @NotBlank(message = "Search term is required")
    @Size(min = 1, max = 255, message = "Search term must be between 1 and 255 characters")
    private String searchTerm;

    @PositiveOrZero(message = "Page number must be greater than or equal to 0")
    private int page = 0;

    @Positive(message = "Page size must be greater than 0")
    @Max(value = 100, message = "Page size must not exceed 100")
    private int size = 20;

    private Integer categoryId;

    @Pattern(regexp = "ACTIVE|INACTIVE", message = "Status must be ACTIVE or INACTIVE")
    private String status;

    private String sortBy = "id";

    @Pattern(regexp = "asc|desc", message = "Sort direction must be asc or desc")
    private String sortDirection = "desc";
}
