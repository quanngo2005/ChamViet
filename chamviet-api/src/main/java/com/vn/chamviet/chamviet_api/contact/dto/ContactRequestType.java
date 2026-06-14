package com.vn.chamviet.chamviet_api.contact.dto;

public enum ContactRequestType {
    INFO_REQUEST,
    PREORDER_REQUEST;

    public static ContactRequestType fromValue(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Request type is required");
        }

        return switch (value.trim().toLowerCase()) {
            case "info_request" -> INFO_REQUEST;
            case "preorder_request" -> PREORDER_REQUEST;
            default -> throw new IllegalArgumentException("Unsupported request type");
        };
    }
}
