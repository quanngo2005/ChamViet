package com.vn.chamviet.chamviet_api.product.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.vn.chamviet.chamviet_api.product.*;
import com.vn.chamviet.chamviet_api.product.dto.*;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class ProductMapper {
    public ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
            .id(product.getId())
            .name(product.getName())
            .slug(product.getSlug())
            .description(product.getDescription())
            .status(product.getStatus().name())
            .category(toCategoryDTO(product.getCategory()))
            .images(product.getImages() == null ? List.of() : product.getImages().stream()
                .sorted(Comparator.comparing(ProductImage::getSortOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(this::toImageDTO)
                .toList())
            .variants(product.getVariants() == null ? List.of() : product.getVariants().stream()
                .sorted(Comparator.comparing(ProductVariant::getId))
                .map(this::toVariantDTO)
                .toList())
            .build();
    }

    public ProductVariantDTO toVariantDTO(ProductVariant variant) {
        return ProductVariantDTO.builder()
            .id(variant.getId())
            .sku(variant.getSku())
            .price(variant.getPrice())
            .componentCount(variant.getComponentCount())
            .attributes(toPlainJson(variant.getAttributes()))
            .components(variant.getComponents() == null ? List.of() : variant.getComponents().stream()
                .sorted(Comparator.comparing(ProductVariantComponent::getSortOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(this::toVariantComponentDTO)
                .toList())
            .build();
    }

    public ProductVariantComponentDTO toVariantComponentDTO(ProductVariantComponent component) {
        com.vn.chamviet.chamviet_api.product.Component item = component.getComponent();
        ComponentContent content = item.getContent();
        return ProductVariantComponentDTO.builder()
            .id(component.getId())
            .componentId(item.getId())
            .componentSku(item.getSku())
            .componentName(item.getName())
            .componentType(item.getComponentType().name())
            .quantity(component.getQuantity())
            .sortOrder(component.getSortOrder())
            .videoUrl(content == null ? null : content.getVideoUrl())
            .storyTitle(content == null ? null : content.getStoryTitle())
            .pieceCount(content == null ? null : content.getPieceCount())
            .build();
    }

    public ComponentDTO toComponentDTO(com.vn.chamviet.chamviet_api.product.Component item) {
        ComponentContent content = item.getContent();
        return ComponentDTO.builder()
            .id(item.getId())
            .sku(item.getSku())
            .name(item.getName())
            .componentType(item.getComponentType().name())
            .ageRangeId(item.getAgeRange() == null ? null : item.getAgeRange().getId())
            .ageRangeName(item.getAgeRange() == null ? null : item.getAgeRange().getName())
            .videoUrl(content == null ? null : content.getVideoUrl())
            .storyTitle(content == null ? null : content.getStoryTitle())
            .pieceCount(content == null ? null : content.getPieceCount())
            .stockOnHand(item.getStockOnHand())
            .reservedStock(item.getReservedStock())
            .status(item.getStatus().name())
            .build();
    }

    private CategoryDTO toCategoryDTO(Category category) {
        if (category == null) {
            return null;
        }
        return CategoryDTO.builder()
            .id(category.getId())
            .name(category.getName())
            .slug(category.getSlug())
            .parentId(category.getParent() == null ? null : category.getParent().getId())
            .build();
    }

    private ProductImageDTO toImageDTO(ProductImage image) {
        return ProductImageDTO.builder()
            .id(image.getId())
            .imageUrl(image.getImageUrl())
            .sortOrder(image.getSortOrder())
            .isPrimary(image.getIsPrimary())
            .build();
    }

    private Object toPlainJson(JsonNode jsonNode) {
        if (jsonNode == null) {
            return null;
        }
        return jsonNode;
    }
}
