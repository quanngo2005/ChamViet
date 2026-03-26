package com.vn.chamviet.chamviet_api.controller;


import com.vn.chamviet.chamviet_api.dto.AiResponseDTO;
import com.vn.chamviet.chamviet_api.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/api/v1/ai")
public class AIController {
    @Autowired
    AIService aiService;

    @PostMapping(value = "/ai-connection", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AiResponseDTO> testConnection(@RequestParam("file") MultipartFile file) {
        AiResponseDTO response = aiService.testAiConnection(file);
        return ResponseEntity.ok(response);
    }
}
