package com.vn.chamviet.chamviet_api.AI.service;

import com.vn.chamviet.chamviet_api.AI.dto.AiResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class AIService {

    private final WebClient webClient;
    private final Duration visionTimeout;

    public AIService(
            WebClient.Builder webClientBuilder,
            @Value("${ai.vision.base-url:http://localhost:5000}") String visionBaseUrl,
            @Value("${ai.vision.timeout-seconds:15}") long visionTimeoutSeconds
    ) {
        this.webClient = webClientBuilder.baseUrl(visionBaseUrl).build();
        this.visionTimeout = Duration.ofSeconds(visionTimeoutSeconds);
    }

    public AiResponseDTO testAiConnection(MultipartFile file) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", file.getResource())
                .filename(file.getOriginalFilename());

        return webClient.post()
                .uri("/predict")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .retrieve()
                .bodyToMono(AiResponseDTO.class)
                .onErrorResume(e -> {
                    // Xử lý lỗi kết nối hoặc lỗi từ AI Service
                    AiResponseDTO errorRes = new AiResponseDTO();
                    errorRes.setStatus("error");
                    return Mono.just(errorRes);
                })
                .block(visionTimeout);
    }
    
}
