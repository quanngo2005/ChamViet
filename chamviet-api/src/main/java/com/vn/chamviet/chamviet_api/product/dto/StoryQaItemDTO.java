package com.vn.chamviet.chamviet_api.product.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryQaItemDTO {
    private Integer id;
    private String question;
    private String answer;
}
