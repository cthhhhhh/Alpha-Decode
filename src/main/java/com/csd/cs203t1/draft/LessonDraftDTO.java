package com.csd.cs203t1.draft;

import com.csd.cs203t1.question.QuestionDTO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class LessonDraftDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaveDraftRequest {
        private String title;
        private String colour;
        private String story;
        private String emoji;
        private List<QuestionDTO> questions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DraftSummary {
        private Long id;
        private String title;
        private String colour;
        private String emoji;
        private String status;
        private String rejectionNote;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String contributorUsername;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DraftDetail {
        private Long id;
        private String title;
        private String colour;
        private String story;
        private String emoji;
        private String status;
        private String rejectionNote;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String contributorUsername;
        private List<QuestionDTO> questions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewRequest {
        private String action;
        private String rejectionNote;
    }
}
