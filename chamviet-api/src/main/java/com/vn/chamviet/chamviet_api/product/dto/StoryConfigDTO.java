package com.vn.chamviet.chamviet_api.product.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryConfigDTO {
    private Long componentId;
    private String componentSku;
    private String videoId;
    private String videoUrl;
    private String storyTitle;
    private Integer childAge;
    private Integer pieceCount;
    private String storyContent;
    private List<StoryQaItemDTO> qaList;
}
