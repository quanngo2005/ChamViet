package com.vn.chamviet.chamviet_api.product.service;

import com.vn.chamviet.chamviet_api.product.Product;
import com.vn.chamviet.chamviet_api.product.ProductVariant;
import com.vn.chamviet.chamviet_api.product.dto.ProductDTO;
import com.vn.chamviet.chamviet_api.product.mapper.ProductMapper;
import com.vn.chamviet.chamviet_api.product.repository.ProductRepo;
import com.vn.chamviet.chamviet_api.product.repository.ProductVariantRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class ProductService {
    private final ProductRepo productRepo;
    private final ProductVariantRepo productVariantRepo;
    private final ProductMapper productMapper;
    private final ProductVariantCompositionService compositionService;

    @Transactional(readOnly = true)
    public ProductDTO getProduct(Long productId) {
        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));
        product.getVariants().forEach(compositionService::validateBoxVariant);
        return productMapper.toDTO(product);
    }

    @Transactional(readOnly = true)
    public ProductVariant getDetailedVariant(Long variantId) {
        ProductVariant variant = productVariantRepo.findDetailedById(variantId)
            .orElseThrow(() -> new EntityNotFoundException("Product variant not found: " + variantId));
        compositionService.validateBoxVariant(variant);
        return variant;
    }
}
