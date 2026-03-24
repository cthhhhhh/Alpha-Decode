package com.csd.cs203t1.achievement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class AchievementDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AchievementInfo {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private String triggerType;
        private int threshold;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserAchievementInfo {
        private Long achievementId;
        private String name;
        private String description;
        private String icon;
        private LocalDateTime unlockedAt;
    }
}
