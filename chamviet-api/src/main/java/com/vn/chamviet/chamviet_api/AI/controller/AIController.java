package com.vn.chamviet.chamviet_api.AI.controller;


import com.vn.chamviet.chamviet_api.AI.dto.AiResponseDTO;
import com.vn.chamviet.chamviet_api.AI.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({"/api/v1/ai", "/api/v1/vision"})
public class AIController {
    @Autowired
    AIService aiService;

    @PostMapping(value = "/ai-connection", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AiResponseDTO> testConnection(@RequestParam("file") MultipartFile file) {
        AiResponseDTO response = aiService.testAiConnection(file);
        return ResponseEntity.ok(response);
    }
}
