package com.vn.chamviet.chamviet_api.product.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vn.chamviet.chamviet_api.product.Component;
import com.vn.chamviet.chamviet_api.product.ComponentContent;
import com.vn.chamviet.chamviet_api.product.ProductVariantComponent;
import com.vn.chamviet.chamviet_api.product.dto.ComponentLookupDTO;
import com.vn.chamviet.chamviet_api.product.dto.StoryConfigDTO;
import com.vn.chamviet.chamviet_api.product.dto.StoryQaItemDTO;
import com.vn.chamviet.chamviet_api.product.repository.ComponentContentRepo;
import com.vn.chamviet.chamviet_api.product.repository.ProductVariantComponentRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductStoryService {
    private static final Map<String, String> LABEL_COMPONENT_SKU_MAP = Map.of(
        "auco_laclongquan", "PUZ-LLQ-01",
        "laclongquan_auco", "PUZ-LLQ-01",
        "hoguom", "PUZ-HG-01",
        "ho_guom", "PUZ-HG-01",
        "thanhgiong", "PUZ-TG-01",
        "thanh_giong", "PUZ-TG-01"
    );

    private final ComponentContentRepo componentContentRepo;
    private final ProductVariantComponentRepo productVariantComponentRepo;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public StoryConfigDTO getStoryByVideoId(String videoId) {
        ComponentContent content = componentContentRepo.findByComponentComponentType(Component.ComponentType.PUZZLE).stream()
            .filter(item -> Objects.equals(extractVideoId(item.getVideoUrl()), videoId))
            .findFirst()
            .orElseThrow(() -> new EntityNotFoundException("Puzzle story not found for video ID: " + videoId));

        return toStoryConfig(content, videoId);
    }

    @Transactional(readOnly = true)
    public Optional<ComponentLookupDTO> lookupByLabel(String label) {
        String componentSku = LABEL_COMPONENT_SKU_MAP.get(normalizeVisionLabel(label));
        if (componentSku == null || componentSku.isBlank()) {
            return Optional.empty();
        }

        return lookupByComponentSku(componentSku);
    }

    private String normalizeVisionLabel(String label) {
        if (label == null) {
            return "";
        }
        return label.trim().toLowerCase().replaceAll("[\\s-]+", "_");
    }

    @Transactional(readOnly = true)
    public Optional<ComponentLookupDTO> lookupByComponentSku(String sku) {
        return productVariantComponentRepo.findFirstByComponentSkuOrderBySortOrderAsc(sku)
            .map(this::toComponentLookup);
    }

    private StoryConfigDTO toStoryConfig(ComponentContent content, String videoId) {
        Component component = content.getComponent();
        return StoryConfigDTO.builder()
            .componentId(component.getId())
            .componentSku(component.getSku())
            .videoId(videoId)
            .videoUrl(content.getVideoUrl())
            .storyTitle(content.getStoryTitle())
            .childAge(component.getAgeRange() == null ? 6 : component.getAgeRange().getMinAge())
            .pieceCount(content.getPieceCount())
            .storyContent(content.getStoryContent())
            .qaList(parseQaList(content.getStoryQaJson()))
            .build();
    }

    private ComponentLookupDTO toComponentLookup(ProductVariantComponent variantComponent) {
        Long productId = variantComponent.getProductVariant() == null || variantComponent.getProductVariant().getProduct() == null
            ? null
            : variantComponent.getProductVariant().getProduct().getId();

        return ComponentLookupDTO.builder()
            .productId(productId)
            .variantId(variantComponent.getProductVariant() == null ? null : variantComponent.getProductVariant().getId())
            .componentId(variantComponent.getComponent() == null ? null : variantComponent.getComponent().getId())
            .componentSku(variantComponent.getComponent() == null ? null : variantComponent.getComponent().getSku())
            .route(productId == null ? null : "/products/" + productId)
            .build();
    }

    private List<StoryQaItemDTO> parseQaList(String storyQaJson) {
        try {
            return objectMapper.readValue(storyQaJson, new TypeReference<List<StoryQaItemDTO>>() { });
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Invalid story QA JSON", exception);
        }
    }

    private String extractVideoId(String videoUrl) {
        if (videoUrl == null || videoUrl.isBlank()) {
            return null;
        }
        if (!videoUrl.contains("://")) {
            return videoUrl.trim();
        }
        if (videoUrl.contains("watch?v=")) {
            String[] split = videoUrl.split("watch\\?v=");
            return split[1].split("&")[0];
        }
        if (videoUrl.contains("youtu.be/")) {
            return videoUrl.substring(videoUrl.indexOf("youtu.be/") + 9).split("\\?")[0];
        }
        return videoUrl.trim();
    }
}
