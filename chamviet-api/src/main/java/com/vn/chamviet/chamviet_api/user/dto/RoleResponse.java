package com.vn.chamviet.chamviet_api.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RoleResponse {
    private Integer id;
    private String name;
    private String description;
}
