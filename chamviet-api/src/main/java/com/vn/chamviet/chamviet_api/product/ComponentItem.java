package com.vn.chamviet.chamviet_api.product;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "component_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class ComponentItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long id;

    @Version
    private Long version;

    @Column(nullable = false, unique = true, length = 100)
    @ToString.Include
    private String sku;

    @Column(nullable = false, length = 255)
    @ToString.Include
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "component_type", nullable = false, length = 30)
    @ToString.Include
    private ComponentType componentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "age_range_id")
    private AgeRange ageRange;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(name = "story_title", length = 255)
    private String storyTitle;

    @Column(name = "story_content", columnDefinition = "TEXT")
    private String storyContent;

    @Column(name = "story_qa_json", columnDefinition = "TEXT")
    private String storyQaJson;

    @Column(name = "piece_count")
    private Integer pieceCount;

    @PositiveOrZero
    @Column(name = "stock_on_hand", nullable = false)
    private Integer stockOnHand = 0;

    @PositiveOrZero
    @Column(name = "reserved_stock", nullable = false)
    private Integer reservedStock = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ComponentStatus status = ComponentStatus.ACTIVE;

    @OneToMany(mappedBy = "componentItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<ProductVariantComponent> variantComponents;

    @AssertTrue(message = "PUZZLE components require video, story title, story content, story QA JSON, and piece count")
    public boolean hasRequiredPuzzleMetadata() {
        if (componentType != ComponentType.PUZZLE) {
            return true;
        }
        return hasText(videoUrl)
            && hasText(storyTitle)
            && hasText(storyContent)
            && hasText(storyQaJson)
            && pieceCount != null
            && pieceCount > 0;
    }

    @AssertTrue(message = "Only PUZZLE components may contain story metadata")
    public boolean isNonPuzzleMetadataClean() {
        if (componentType == ComponentType.PUZZLE) {
            return true;
        }
        return !hasText(videoUrl)
            && !hasText(storyTitle)
            && !hasText(storyContent)
            && !hasText(storyQaJson)
            && pieceCount == null
            && ageRange == null;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    public enum ComponentType {
        PUZZLE,
        PEPPER_GHOST
    }

    public enum ComponentStatus {
        ACTIVE,
        INACTIVE
    }
}
