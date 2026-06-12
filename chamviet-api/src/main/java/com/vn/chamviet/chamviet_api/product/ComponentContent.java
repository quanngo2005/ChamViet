package com.vn.chamviet.chamviet_api.product;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import lombok.*;

@Entity
@Table(name = "component_content")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class ComponentContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false, unique = true)
    private Component component;

    @Column(name = "video_url", nullable = false, length = 500)
    private String videoUrl;

    @Column(name = "story_title", nullable = false, length = 255)
    private String storyTitle;

    @Column(name = "story_content", nullable = false, columnDefinition = "TEXT")
    private String storyContent;

    @Column(name = "story_qa_json", nullable = false, columnDefinition = "TEXT")
    private String storyQaJson;

    @Column(name = "piece_count", nullable = false)
    private Integer pieceCount;

    @AssertTrue(message = "Component content must belong to a PUZZLE component")
    public boolean belongsToPuzzleComponent() {
        return component == null || component.getComponentType() == Component.ComponentType.PUZZLE;
    }
}
