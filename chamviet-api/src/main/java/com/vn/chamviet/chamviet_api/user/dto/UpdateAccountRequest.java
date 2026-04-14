package com.vn.chamviet.chamviet_api.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UpdateAccountRequest {
    private String currentPassword;
    private String newPassword;
    private String email;
    private String fullName;
    private String phone;
}
