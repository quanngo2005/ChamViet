package com.vn.chamviet.chamviet_api.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PaginationRequest {
    private int page = 0;
    private int pageSize = 10;
    private String sortBy = "id";
    private String sortDirection = "ASC";
}
