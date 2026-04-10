package com.vn.chamviet.chamviet_api.AI.service;

import com.vn.chamviet.chamviet_api.AI.dto.voice.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Proxy service for the Voice AI Python FastAPI backend (port 8000).
 * Each method maps 1:1 to a Python endpoint, forwarding requests and
 * returning the response to the controller layer.
 */
@Service
public class VoiceAIService {

    private final WebClient voiceClient;

    public VoiceAIService(WebClient.Builder webClientBuilder) {
        this.voiceClient = webClientBuilder.baseUrl("http://localhost:8000").build();
    }

    // ════════════════════════════════════════════════════════
    // SYSTEM
    // ════════════════════════════════════════════════════════

    public ContentResponse loadContent(ContentRequest request) {
        return voiceClient.post()
                .uri("/api/load-content")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ContentResponse.class)
                .onErrorResume(e -> Mono.just(new ContentResponse("error", 0, 0)))
                .block();
    }

    public TextResponse transcribe(MultipartFile audio) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        try {
            builder.part("audio", new ByteArrayResource(audio.getBytes()) {
                @Override
                public String getFilename() {
                    return audio.getOriginalFilename() != null
                            ? audio.getOriginalFilename() : "recording.wav";
                }
            }).contentType(MediaType.parseMediaType(
                    audio.getContentType() != null ? audio.getContentType() : "audio/wav"));
        } catch (Exception e) {
            return new TextResponse("");
        }

        return voiceClient.post()
                .uri("/api/transcribe")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .retrieve()
                .bodyToMono(TextResponse.class)
                .onErrorResume(e -> Mono.just(new TextResponse("")))
                .block();
    }

    public byte[] speak(TextRequest request) {
        return voiceClient.post()
                .uri("/api/speak")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(byte[].class)
                .onErrorResume(e -> Mono.just(new byte[0]))
                .block();
    }

    public Map<String, Object> reset() {
        return voiceClient.post()
                .uri("/api/reset")
                .retrieve()
                .bodyToMono(new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {})
                .onErrorResume(e -> Mono.just(Map.of("status", "error")))
                .block();
    }

    // ════════════════════════════════════════════════════════
    // CONVERSATION
    // ════════════════════════════════════════════════════════

    public TextResponse greeting(StoryRequest request) {
        return postForText("/api/greeting", request);
    }

    public TextResponse readQuestion(QuestionRequest request) {
        return postForText("/api/read-question", request);
    }

    public ClassifyResponse classify(ClassifyRequest request) {
        return voiceClient.post()
                .uri("/api/classify")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ClassifyResponse.class)
                .onErrorResume(e -> Mono.just(new ClassifyResponse("ERROR")))
                .block();
    }

    public MatchResponse match(MatchRequest request) {
        return voiceClient.post()
                .uri("/api/match")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(MatchResponse.class)
                .onErrorResume(e -> Mono.just(new MatchResponse(0.0)))
                .block();
    }

    public TextResponse correct(AnswerEvalRequest request) {
        return postForText("/api/correct", request);
    }

    public TextResponse wrong(AnswerEvalRequest request) {
        return postForText("/api/wrong", request);
    }

    public TextResponse unclear(QuestionRequest request) {
        return postForText("/api/unclear", request);
    }

    public TextResponse confused(ConfusedRequest request) {
        return postForText("/api/confused", request);
    }

    public TextResponse explain(ExplainRequest request) {
        return postForText("/api/explain", request);
    }

    public TextResponse afterExplain(AfterExplainRequest request) {
        return postForText("/api/after-explain", request);
    }

    public TextResponse ending(EndingRequest request) {
        return postForText("/api/ending", request);
    }

    // ════════════════════════════════════════════════════════
    // HELPER
    // ════════════════════════════════════════════════════════

    private TextResponse postForText(String uri, Object body) {
        return voiceClient.post()
                .uri(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(TextResponse.class)
                .onErrorResume(e -> Mono.just(new TextResponse("")))
                .block();
    }
}
