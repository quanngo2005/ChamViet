package com.vn.chamviet.chamviet_api.AI.service;

import com.vn.chamviet.chamviet_api.AI.dto.AiResponseDTO;
import com.vn.chamviet.chamviet_api.product.dto.ComponentLookupDTO;
import com.vn.chamviet.chamviet_api.product.service.ProductStoryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AIService {

    private final WebClient webClient;
    private final Duration visionTimeout;
    private final ProductStoryService productStoryService;

    public AIService(
            WebClient.Builder webClientBuilder,
            @Value("${ai.vision.base-url:http://localhost:5000}") String visionBaseUrl,
            @Value("${ai.vision.timeout-seconds:15}") long visionTimeoutSeconds,
            ProductStoryService productStoryService
    ) {
        this.webClient = webClientBuilder.baseUrl(visionBaseUrl).build();
        this.visionTimeout = Duration.ofSeconds(visionTimeoutSeconds);
        this.productStoryService = productStoryService;
    }

    public AiResponseDTO testAiConnection(MultipartFile file) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", file.getResource())
                .filename(file.getOriginalFilename());

        AiResponseDTO response = webClient.post()
                .uri("/predict")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .retrieve()
                .bodyToMono(AiResponseDTO.class)
                .onErrorResume(e -> {
                    // Xử lý lỗi kết nối hoặc lỗi từ AI Service
                    AiResponseDTO errorRes = new AiResponseDTO();
                    errorRes.setStatus("error");
                    errorRes.setMessage("Không thể kết nối dịch vụ nhận diện. Vui lòng thử lại.");
                    return Mono.just(errorRes);
                })
                .block(visionTimeout);

        if (hasMultipleDetectedLabels(response)) {
            response.setStatus("error");
            response.setMessage("Vui lòng chỉ chụp 1 sản phẩm.");
            response.setRoute(null);
            response.setProductId(null);
            response.setVariantId(null);
            response.setComponentId(null);
            response.setComponentSku(null);
            return response;
        }

        enrichWithProductRoute(response);
        enrichWithStoryRoute(response);
        return response;
    }

    private boolean hasMultipleDetectedLabels(AiResponseDTO response) {
        if (response == null || response.getData() == null || response.getData().isEmpty()) {
            return false;
        }

        Set<String> labels = response.getData().stream()
            .map(AiResponseDTO.PredictionData::getLabel)
            .filter(label -> label != null && !label.isBlank())
            .map(this::normalizeVisionLabel)
            .collect(Collectors.toSet());

        return labels.size() > 1;
    }

    private void enrichWithProductRoute(AiResponseDTO response) {
        if (response == null || response.getData() == null || response.getData().isEmpty()) {
            return;
        }

        AiResponseDTO.PredictionData bestPrediction = response.getData().stream()
            .filter(prediction -> prediction.getLabel() != null && prediction.getConfidence() != null)
            .max(Comparator.comparing(AiResponseDTO.PredictionData::getConfidence))
            .orElse(null);

        if (bestPrediction == null) {
            return;
        }

        productStoryService.lookupByLabel(bestPrediction.getLabel())
            .ifPresent(lookup -> applyLookup(response, lookup));
    }

    private void enrichWithStoryRoute(AiResponseDTO response) {
        if (response == null || response.getData() == null || response.getData().isEmpty()) {
            return;
        }

        AiResponseDTO.PredictionData bestPrediction = response.getData().stream()
            .filter(prediction -> prediction.getLabel() != null && prediction.getConfidence() != null)
            .max(Comparator.comparing(AiResponseDTO.PredictionData::getConfidence))
            .orElse(null);

        if (bestPrediction == null) {
            return;
        }

        productStoryService.lookupStorySlugByLabel(bestPrediction.getLabel())
            .ifPresent(slug -> response.setRoute("/story/" + slug));
    }

    private void applyLookup(AiResponseDTO response, ComponentLookupDTO lookup) {
        response.setProductId(lookup.getProductId());
        response.setVariantId(lookup.getVariantId());
        response.setComponentId(lookup.getComponentId());
        response.setComponentSku(lookup.getComponentSku());
        response.setRoute(lookup.getRoute());
    }

    private String normalizeVisionLabel(String label) {
        return label.trim().toLowerCase().replaceAll("[\\s-]+", "_");
    }
}
