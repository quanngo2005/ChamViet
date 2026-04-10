package com.vn.chamviet.chamviet_api.AI.controller;

import com.vn.chamviet.chamviet_api.AI.dto.voice.*;
import com.vn.chamviet.chamviet_api.AI.service.VoiceAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * REST controller for Voice AI interaction.
 * Proxies all requests to the Python FastAPI voice service via VoiceAIService.
 */
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/v1/voice")
public class VoiceAIController {

    @Autowired
    private VoiceAIService voiceAIService;

    // ════════════════════════════════════════════════════════
    // SYSTEM
    // ════════════════════════════════════════════════════════

    @PostMapping("/load-content")
    public ResponseEntity<ContentResponse> loadContent(@RequestBody ContentRequest request) {
        return ResponseEntity.ok(voiceAIService.loadContent(request));
    }

    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TextResponse> transcribe(@RequestParam("audio") MultipartFile audio) {
        return ResponseEntity.ok(voiceAIService.transcribe(audio));
    }

    @PostMapping("/speak")
    public ResponseEntity<byte[]> speak(@RequestBody TextRequest request) {
        byte[] audioBytes = voiceAIService.speak(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reply.wav")
                .contentType(MediaType.parseMediaType("audio/wav"))
                .body(audioBytes);
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> reset() {
        return ResponseEntity.ok(voiceAIService.reset());
    }

    // ════════════════════════════════════════════════════════
    // CONVERSATION
    // ════════════════════════════════════════════════════════

    @PostMapping("/greeting")
    public ResponseEntity<TextResponse> greeting(@RequestBody StoryRequest request) {
        return ResponseEntity.ok(voiceAIService.greeting(request));
    }

    @PostMapping("/read-question")
    public ResponseEntity<TextResponse> readQuestion(@RequestBody QuestionRequest request) {
        return ResponseEntity.ok(voiceAIService.readQuestion(request));
    }

    @PostMapping("/classify")
    public ResponseEntity<ClassifyResponse> classify(@RequestBody ClassifyRequest request) {
        return ResponseEntity.ok(voiceAIService.classify(request));
    }

    @PostMapping("/match")
    public ResponseEntity<MatchResponse> match(@RequestBody MatchRequest request) {
        return ResponseEntity.ok(voiceAIService.match(request));
    }

    @PostMapping("/correct")
    public ResponseEntity<TextResponse> correct(@RequestBody AnswerEvalRequest request) {
        return ResponseEntity.ok(voiceAIService.correct(request));
    }

    @PostMapping("/wrong")
    public ResponseEntity<TextResponse> wrong(@RequestBody AnswerEvalRequest request) {
        return ResponseEntity.ok(voiceAIService.wrong(request));
    }

    @PostMapping("/unclear")
    public ResponseEntity<TextResponse> unclear(@RequestBody QuestionRequest request) {
        return ResponseEntity.ok(voiceAIService.unclear(request));
    }

    @PostMapping("/confused")
    public ResponseEntity<TextResponse> confused(@RequestBody ConfusedRequest request) {
        return ResponseEntity.ok(voiceAIService.confused(request));
    }

    @PostMapping("/explain")
    public ResponseEntity<TextResponse> explain(@RequestBody ExplainRequest request) {
        return ResponseEntity.ok(voiceAIService.explain(request));
    }

    @PostMapping("/after-explain")
    public ResponseEntity<TextResponse> afterExplain(@RequestBody AfterExplainRequest request) {
        return ResponseEntity.ok(voiceAIService.afterExplain(request));
    }

    @PostMapping("/ending")
    public ResponseEntity<TextResponse> ending(@RequestBody EndingRequest request) {
        return ResponseEntity.ok(voiceAIService.ending(request));
    }
}
