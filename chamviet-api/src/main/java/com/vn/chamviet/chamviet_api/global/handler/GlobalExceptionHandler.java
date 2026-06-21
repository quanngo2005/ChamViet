package com.vn.chamviet.chamviet_api.global.handler;

import com.vn.chamviet.chamviet_api.global.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxUploadSizeExceeded() {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
            .body(ApiResponse.error(
                "Bản ghi âm vượt quá dung lượng cho phép.",
                "Payload Too Large",
                HttpStatus.PAYLOAD_TOO_LARGE.value()
            ));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException exception) {
        int statusCode = exception.getStatusCode().value();
        String reason = exception.getReason();
        String message = reason != null && !reason.isBlank()
            ? reason
            : "Request failed";

        return ResponseEntity.status(exception.getStatusCode())
            .body(ApiResponse.error(message, message, statusCode));
    }
}
