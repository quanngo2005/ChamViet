package com.vn.chamviet.chamviet_api.global.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class StatusChangeRequest {
    @NotBlank(message = "Status cannot be blank")
    private String status;
}
