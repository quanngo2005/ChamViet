package com.vn.chamviet.chamviet_api.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AccountDTO {
    private Long id;
    private RoleDTO role;
    private String email;
    private String fullName;
    private String phone;
    private String status;
}
