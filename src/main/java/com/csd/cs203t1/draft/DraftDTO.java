package com.csd.cs203t1.draft;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class DraftDTO {

    @Getter
    @Setter
    public static class CreateOrUpdateDraftRequest {
        private String title;
        private String story;
        private String emoji;
        private String colour;
        private String questionsJson;
    }

    @Getter
    @Setter
    public static class RejectDraftRequest {
        private String rejectionReason;
    }

    @Getter
    @Setter
    public static class DraftResponse {
        private Long id;
        private Long contributorId;
        private String contributorUsername;
        private String title;
        private String story;
        private String emoji;
        private String colour;
        private String questionsJson;
        private DraftStatus status;
        private String rejectionReason;
        private Long approvedLessonId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
