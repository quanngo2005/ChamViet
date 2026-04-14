package com.vn.chamviet.chamviet_api.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RefreshTokenRequest {
    private String refreshToken;
}
