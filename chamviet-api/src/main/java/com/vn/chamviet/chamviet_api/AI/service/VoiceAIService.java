package com.vn.chamviet.chamviet_api.AI.service;

import com.vn.chamviet.chamviet_api.AI.dto.voice.ChatRequest;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ChatResponse;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ClassifyRequest;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ClassifyResponse;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ContentRequest;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ContentResponse;
import com.vn.chamviet.chamviet_api.AI.dto.voice.TextRequest;
import com.vn.chamviet.chamviet_api.AI.dto.voice.TextResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;

@Service
public class VoiceAIService {

    private final WebClient voiceClient;

    public VoiceAIService(
        WebClient.Builder webClientBuilder,
        @Value("${ai.voice.base-url:http://localhost:8000}") String voiceBaseUrl
    ) {
        this.voiceClient = webClientBuilder.baseUrl(voiceBaseUrl).build();
    }

    public ContentResponse loadContent(ContentRequest request) {
        return execute("load content", () -> voiceClient.post()
            .uri("/api/load-content")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(ContentResponse.class)
            .block());
    }

    public TextResponse transcribe(MultipartFile audio, String sessionId) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        try {
            builder.part("audio", new ByteArrayResource(audio.getBytes()) {
                @Override
                public String getFilename() {
                    return audio.getOriginalFilename() != null
                        ? audio.getOriginalFilename()
                        : "recording.wav";
                }
            }).contentType(MediaType.parseMediaType(
                audio.getContentType() != null ? audio.getContentType() : "audio/wav"
            ));
            if (sessionId != null && !sessionId.isBlank()) {
                builder.part("session_id", sessionId);
            }
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot read uploaded audio", exception);
        }

        return execute("transcribe audio", () -> voiceClient.post()
            .uri("/api/transcribe")
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .body(BodyInserters.fromMultipartData(builder.build()))
            .retrieve()
            .bodyToMono(TextResponse.class)
            .block());
    }

    public ChatResponse chat(ChatRequest request) {
        return execute("chat", () -> voiceClient.post()
            .uri("/api/chat")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(ChatResponse.class)
            .block());
    }

    public ClassifyResponse classify(ClassifyRequest request) {
        return execute("classify intent", () -> voiceClient.post()
            .uri("/api/classify")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(ClassifyResponse.class)
            .block());
    }

    public byte[] speak(TextRequest request) {
        byte[] audioBytes = execute("speak", () -> voiceClient.post()
            .uri("/api/speak")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(byte[].class)
            .block());

        if (audioBytes.length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Voice AI returned empty audio");
        }

        return audioBytes;
    }

    public Map<String, Object> history(String sessionId) {
        return execute("get history", () -> voiceClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/api/history")
                .queryParamIfPresent("session_id", Optional.ofNullable(blankToNull(sessionId)))
                .build())
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() { })
            .block());
    }

    public Map<String, Object> reset(String sessionId) {
        return execute("reset session", () -> voiceClient.post()
            .uri(uriBuilder -> uriBuilder
                .path("/api/reset")
                .queryParamIfPresent("session_id", Optional.ofNullable(blankToNull(sessionId)))
                .build())
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() { })
            .block());
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value;
    }

    private <T> T execute(String action, Supplier<T> supplier) {
        try {
            T response = supplier.get();
            if (response == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Voice AI returned empty response for " + action
                );
            }
            return response;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (WebClientResponseException exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Voice AI " + action + " failed with status " + exception.getStatusCode().value(),
                exception
            );
        } catch (Exception exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Voice AI " + action + " is unavailable",
                exception
            );
        }
    }
}
