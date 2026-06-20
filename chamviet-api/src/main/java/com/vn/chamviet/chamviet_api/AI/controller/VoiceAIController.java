package com.vn.chamviet.chamviet_api.AI.controller;

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
import com.vn.chamviet.chamviet_api.AI.service.VoiceAIService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/voice")
public class VoiceAIController {

    private static final String VOICE_META_HEADER = "X-Voice-Meta";

    private final VoiceAIService voiceAIService;

    public VoiceAIController(VoiceAIService voiceAIService) {
        this.voiceAIService = voiceAIService;
    }

    @PostMapping("/load-content")
    public ResponseEntity<ContentResponse> loadContent(@RequestBody ContentRequest request) {
        return ResponseEntity.ok(voiceAIService.loadContent(request));
    }

    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TextResponse> transcribe(
        @RequestParam("audio") MultipartFile audio,
        @RequestParam(value = "session_id", required = false) String sessionId
    ) {
        return ResponseEntity.ok(voiceAIService.transcribe(audio, sessionId));
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(voiceAIService.chat(request));
    }

    @PostMapping("/classify")
    public ResponseEntity<ClassifyResponse> classify(@RequestBody ClassifyRequest request) {
        return ResponseEntity.ok(voiceAIService.classify(request));
    }

    @PostMapping("/evaluate-answer")
    public ResponseEntity<AnswerEvalResponse> evaluateAnswer(@RequestBody AnswerEvalRequest request) {
        return ResponseEntity.ok(voiceAIService.evaluateAnswer(request));
    }

    @PostMapping("/speak")
    public ResponseEntity<byte[]> speak(@RequestBody TextRequest request) {
        byte[] audioBytes = voiceAIService.speak(request);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reply.wav")
            .contentType(MediaType.parseMediaType("audio/wav"))
            .body(audioBytes);
    }

    @PostMapping("/session/start")
    public ResponseEntity<byte[]> startSession(@RequestBody VoiceQAStartRequest request) {
        VoiceAudioResponse response = voiceAIService.startSession(request);
        return voiceAudioResponse(response);
    }

    @PostMapping(value = "/session/answer", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> answerSession(
        @RequestParam("audio") MultipartFile audio,
        @RequestParam(value = "session_id", required = false) String sessionId
    ) {
        VoiceAudioResponse response = voiceAIService.answerSession(audio, sessionId);
        return voiceAudioResponse(response);
    }

    @PostMapping("/session/next-question")
    public ResponseEntity<byte[]> nextQuestionAudio(
        @RequestParam(value = "session_id", required = false) String sessionId
    ) {
        VoiceAudioResponse response = voiceAIService.nextQuestionAudio(sessionId);
        return voiceAudioResponse(response);
    }

    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> history(
        @RequestParam(value = "session_id", required = false) String sessionId
    ) {
        return ResponseEntity.ok(voiceAIService.history(sessionId));
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> reset(
        @RequestParam(value = "session_id", required = false) String sessionId
    ) {
        return ResponseEntity.ok(voiceAIService.reset(sessionId));
    }

    private ResponseEntity<byte[]> voiceAudioResponse(VoiceAudioResponse response) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reply.wav")
            .header(VOICE_META_HEADER, response.voiceMeta())
            .contentType(MediaType.parseMediaType("audio/wav"))
            .body(response.audioBytes());
    }
}
