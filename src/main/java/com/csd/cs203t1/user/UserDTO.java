package com.csd.cs203t1.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class UserDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private Integer level;
        private Integer xp;
        private Integer maxUnlockedLessonIndex;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private String token;
        private String role;
        private String username;
        private Integer level;
        private Integer xp;
        private Integer maxUnlockedLessonIndex;
        private Integer streak;
        private List<NewAchievementDTO> newAchievements;

        // Backwards-compatible constructor for endpoints that don't check achievements
        public AuthResponse(String token, String role, String username,
                            Integer level, Integer xp, Integer maxUnlockedLessonIndex, Integer streak) {
            this(token, role, username, level, xp, maxUnlockedLessonIndex, streak, null);
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NewAchievementDTO {
        private String name;
        private String icon;
        private String description;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class XpUpdateRequest {
        private int xpToAdd;
        private Integer maxUnlockedLessonIndex;
        private Integer streakToSet;
        private boolean dailyQuizCountIncrement;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LessonProgressUpdateRequest {
        private int maxUnlockedLessonIndex;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateProfileRequest {
        private String username;
    }
}
