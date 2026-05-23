package com.vn.chamviet.chamviet_api.product.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Integer id;
    private String name;
    private String slug;
    private Integer parentId;
}
