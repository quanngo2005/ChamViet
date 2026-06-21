package com.vn.chamviet.chamviet_api.AI.service;

import com.vn.chamviet.chamviet_api.AI.dto.voice.AnswerEvalRequest;
import com.vn.chamviet.chamviet_api.AI.dto.voice.AnswerEvalResponse;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ChatRequest;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ChatResponse;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ClassifyRequest;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ClassifyResponse;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ContentRequest;
import com.vn.chamviet.chamviet_api.AI.dto.voice.ContentResponse;
import com.vn.chamviet.chamviet_api.AI.dto.voice.TextRequest;
import com.vn.chamviet.chamviet_api.AI.dto.voice.TextResponse;
import com.vn.chamviet.chamviet_api.AI.dto.voice.VoiceAudioResponse;
import com.vn.chamviet.chamviet_api.AI.dto.voice.VoiceQAStartRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class VoiceAIService {

    private static final String VOICE_META_HEADER = "X-Voice-Meta";
    private static final String STORY_META_HEADER = "X-Story-Meta";
    private static final long MAX_VOICE_UPLOAD_BYTES = 10L * 1024L * 1024L;
    private static final Pattern JSON_DETAIL_PATTERN = Pattern.compile("\"(?:detail|message|error)\"\\s*:\\s*\"([^\"]+)\"");

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
        byte[] audioBytes = readSupportedWav(audio);
        MultipartBodyBuilder builder = buildAudioMultipart(audio, audioBytes, sessionId);

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

    public AnswerEvalResponse evaluateAnswer(AnswerEvalRequest request) {
        return execute("evaluate answer", () -> voiceClient.post()
            .uri("/api/evaluate-answer")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(AnswerEvalResponse.class)
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

    public VoiceAudioResponse startSession(VoiceQAStartRequest request) {
        ResponseEntity<byte[]> response = execute("start voice session", () -> voiceClient.post()
            .uri("/api/story/start")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .toEntity(byte[].class)
            .block());

        return toVoiceAudioResponse(response, "start voice session");
    }

    public VoiceAudioResponse answerSession(MultipartFile audio, String sessionId) {
        byte[] audioBytes = readSupportedWav(audio);
        MultipartBodyBuilder builder = buildAudioMultipart(audio, audioBytes, sessionId);

        ResponseEntity<byte[]> response = execute("answer voice session", () -> voiceClient.post()
            .uri("/api/story/answer")
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .body(BodyInserters.fromMultipartData(builder.build()))
            .retrieve()
            .toEntity(byte[].class)
            .block());

        return toVoiceAudioResponse(response, "answer voice session");
    }

    public VoiceAudioResponse nextQuestionAudio(String sessionId) {
        ResponseEntity<byte[]> response = execute("load next question audio", () -> voiceClient.post()
            .uri(uriBuilder -> uriBuilder
                .path("/api/story/next-question")
                .queryParamIfPresent("session_id", Optional.ofNullable(blankToNull(sessionId)))
                .build())
            .retrieve()
            .toEntity(byte[].class)
            .block());

        return toVoiceAudioResponse(response, "load next question audio");
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

    private byte[] readSupportedWav(MultipartFile audio) {
        if (audio == null || audio.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không nhận được dữ liệu âm thanh.");
        }
        if (audio.getSize() > MAX_VOICE_UPLOAD_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Bản ghi âm vượt quá dung lượng cho phép.");
        }
        if (!isAllowedAudioContentType(audio.getContentType())) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Content-Type âm thanh không được hỗ trợ.");
        }

        byte[] audioBytes;
        try {
            audioBytes = audio.getBytes();
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không đọc được dữ liệu âm thanh.", exception);
        }

        if (!hasWavHeader(audioBytes)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Định dạng âm thanh không hợp lệ. Vui lòng gửi WAV PCM.");
        }
        return audioBytes;
    }

    private MultipartBodyBuilder buildAudioMultipart(MultipartFile audio, byte[] audioBytes, String sessionId) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("audio", new ByteArrayResource(audioBytes) {
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
        return builder;
    }

    private boolean isAllowedAudioContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return true;
        }
        String normalized = contentType.toLowerCase();
        return normalized.startsWith("audio/wav")
            || normalized.startsWith("audio/x-wav")
            || normalized.startsWith("audio/wave")
            || normalized.startsWith("audio/vnd.wave")
            || normalized.startsWith("application/octet-stream");
    }

    private boolean hasWavHeader(byte[] audioBytes) {
        if (audioBytes.length < 44) {
            return false;
        }
        return audioBytes[0] == 'R'
            && audioBytes[1] == 'I'
            && audioBytes[2] == 'F'
            && audioBytes[3] == 'F'
            && audioBytes[8] == 'W'
            && audioBytes[9] == 'A'
            && audioBytes[10] == 'V'
            && audioBytes[11] == 'E';
    }

    private VoiceAudioResponse toVoiceAudioResponse(ResponseEntity<byte[]> response, String action) {
        if (response == null || response.getBody() == null || response.getBody().length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Voice AI returned empty audio for " + action);
        }

        String voiceMeta = response.getHeaders().getFirst(VOICE_META_HEADER);
        if (voiceMeta == null || voiceMeta.isBlank()) {
            voiceMeta = response.getHeaders().getFirst(STORY_META_HEADER);
        }
        if (voiceMeta == null || voiceMeta.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Voice AI omitted metadata for " + action);
        }

        return new VoiceAudioResponse(response.getBody(), voiceMeta);
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
            HttpStatus status = exception.getStatusCode().is4xxClientError()
                ? HttpStatus.BAD_REQUEST
                : HttpStatus.BAD_GATEWAY;
            String detail = extractVoiceErrorDetail(exception);
            throw new ResponseStatusException(
                status,
                detail != null ? detail : "Voice AI " + action + " failed with status " + exception.getStatusCode().value(),
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

    private String extractVoiceErrorDetail(WebClientResponseException exception) {
        String body = exception.getResponseBodyAsString(StandardCharsets.UTF_8);
        if (body == null || body.isBlank()) {
            return null;
        }
        Matcher matcher = JSON_DETAIL_PATTERN.matcher(body);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return body;
    }

}
