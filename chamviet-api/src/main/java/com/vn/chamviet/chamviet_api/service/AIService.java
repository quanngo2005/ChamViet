package com.vn.chamviet.chamviet_api.service;

import com.vn.chamviet.chamviet_api.dto.AiResponseDTO;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class AIService {

    private final WebClient webClient;

    public AIService(WebClient.Builder webClientBuilder) {
        // Cấu hình URL của AI Service (Python FastAPI)
        this.webClient = webClientBuilder.baseUrl("http://localhost:5000").build();
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
                .block(); // Đợi kết quả trả về (Synchronous)
    }
}
