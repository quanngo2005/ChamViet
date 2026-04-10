package com.vn.chamviet.chamviet_api.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class EditAccountRequest {
    private String email;
    private String fullName;
    private String phone;
    private Integer roleId;
}
