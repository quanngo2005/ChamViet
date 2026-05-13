package com.vn.chamviet.chamviet_api.global.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class IdDTO<T> {
    private T id;
}
