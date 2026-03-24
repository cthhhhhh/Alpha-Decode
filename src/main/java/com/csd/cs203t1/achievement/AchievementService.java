package com.csd.cs203t1.achievement;

import com.csd.cs203t1.user.User;

import java.util.List;

public interface AchievementService {
    List<Achievement> checkAndUnlock(User user);
    List<AchievementDTO.AchievementInfo> getAllAchievements();
    List<AchievementDTO.UserAchievementInfo> getUserAchievements(User user);
}
