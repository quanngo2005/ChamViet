package com.vn.chamviet.chamviet_api.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone;
}
