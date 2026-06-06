package com.vn.chamviet.chamviet_api.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComponentLookupDTO {
    private Long productId;
    private Long variantId;
    private Long componentId;
    private String componentSku;
    private String route;
}
