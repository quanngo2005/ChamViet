package com.vn.chamviet.chamviet_api.product.controller;

import com.vn.chamviet.chamviet_api.global.dto.ApiResponse;
import com.vn.chamviet.chamviet_api.product.dto.ProductDTO;
import com.vn.chamviet.chamviet_api.product.dto.StoryConfigDTO;
import com.vn.chamviet.chamviet_api.product.service.ProductService;
import com.vn.chamviet.chamviet_api.product.service.ProductStoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicProductController {
    private final ProductService productService;
    private final ProductStoryService productStoryService;

    @GetMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProduct(@PathVariable Long productId) {
        try {
            ProductDTO product = productService.getProduct(productId);
            return ResponseEntity.ok(ApiResponse.success(product, "Product loaded", HttpStatus.OK.value()));
        } catch (EntityNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Product not found", exception.getMessage(), HttpStatus.NOT_FOUND.value()));
        }
    }
    @CrossOrigin(origins = {"https://www.chamviet.com.vn","https://chamviet.com.vn"})
    @GetMapping("/puzzle-stories/video/{videoId}")
    public ResponseEntity<ApiResponse<StoryConfigDTO>> getStoryByVideoId(@PathVariable String videoId) {
        try {
            StoryConfigDTO storyConfig = productStoryService.getStoryByVideoId(videoId);
            return ResponseEntity.ok(ApiResponse.success(storyConfig, "Story config loaded", HttpStatus.OK.value()));
        } catch (EntityNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Story config not found", exception.getMessage(), HttpStatus.NOT_FOUND.value()));
        }
    }

    @CrossOrigin(origins = {"https://www.chamviet.com.vn","https://chamviet.com.vn"})
    @GetMapping("/puzzle-stories/slug/{slug}")
    public ResponseEntity<ApiResponse<StoryConfigDTO>> getStoryBySlug(@PathVariable String slug) {
        try {
            StoryConfigDTO storyConfig = productStoryService.getStoryBySlug(slug);
            return ResponseEntity.ok(ApiResponse.success(storyConfig, "Story config loaded", HttpStatus.OK.value()));
        } catch (EntityNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Story config not found", exception.getMessage(), HttpStatus.NOT_FOUND.value()));
        }
    }
}
