package com.csd.cs203t1.flag;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class FlagDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CreateFlagRequest {
        private String contentType;
        private Long contentId;
        private String reason;
        private String details;
        private String contentContext;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FlagResponse {
        private Long id;
        private String contentType;
        private Long contentId;
        private String reason;
        private String details;
        private String status;
        private LocalDateTime createdAt;
        private String reportedBy;
        private String contentContext;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateStatusRequest {
        private String status;
    }
}
