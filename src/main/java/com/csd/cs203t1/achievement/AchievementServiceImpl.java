package com.csd.cs203t1.achievement;

import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public AchievementServiceImpl(AchievementRepository achievementRepository,
                                   UserAchievementRepository userAchievementRepository) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    @Override
    public List<Achievement> checkAndUnlock(User user) {
        List<Achievement> all = achievementRepository.findAll();
        List<UserAchievement> alreadyUnlocked = userAchievementRepository.findByUser(user);
        Set<Long> unlockedIds = alreadyUnlocked.stream()
                .map(ua -> ua.getAchievement().getId())
                .collect(Collectors.toSet());

        List<Achievement> newlyUnlocked = new ArrayList<>();
        
        // Admin gets everything unlocked regardless of thresholds
        if (user.getRole() == Role.ADMIN) {
            for (Achievement a : all) {
                if (unlockedIds.contains(a.getId())) continue;
                UserAchievement ua = UserAchievement.builder()
                        .user(user)
                        .achievement(a)
                        .unlockedAt(LocalDateTime.now())
                        .build();
                userAchievementRepository.save(java.util.Objects.requireNonNull(ua));
                newlyUnlocked.add(a);
            }
            return newlyUnlocked;
        }

        for (Achievement a : all) {
            if (unlockedIds.contains(a.getId())) continue;
            boolean meets = switch (a.getTriggerType()) {
                case LESSON_COMPLETE -> user.getMaxUnlockedLessonIndex() >= a.getThreshold();
                case STREAK_DAYS -> user.getStreak() >= a.getThreshold();
                case DAILY_QUIZ_COUNT -> user.getDailyQuizCount() >= a.getThreshold();
                case XP_REACHED -> user.getCoins() >= a.getThreshold();
            };
            if (meets) {
                UserAchievement ua = UserAchievement.builder()
                        .user(user)
                        .achievement(a)
                        .unlockedAt(LocalDateTime.now())
                        .build();
                userAchievementRepository.save(java.util.Objects.requireNonNull(ua));
                newlyUnlocked.add(a);
            }
        }
        return newlyUnlocked;
    }

    @Override
    public List<AchievementDTO.AchievementInfo> getAllAchievements() {
        return achievementRepository.findAll().stream()
                .map(a -> new AchievementDTO.AchievementInfo(
                        a.getId(), a.getName(), a.getDescription(), a.getIcon(),
                        a.getTriggerType().toString(), a.getThreshold()))
                .collect(Collectors.toList());
    }

    @Override
    public List<AchievementDTO.UserAchievementInfo> getUserAchievements(User user) {
        List<UserAchievement> unlocked = userAchievementRepository.findByUser(user);
        
        // If admin, return all achievements as if unlocked (even if not yet saved in DB)
        if (user.getRole() == Role.ADMIN) {
            List<Achievement> all = achievementRepository.findAll();
            return all.stream()
                    .map(a -> {
                        LocalDateTime unlockedAt = unlocked.stream()
                                .filter(ua -> ua.getAchievement().getId().equals(a.getId()))
                                .map(UserAchievement::getUnlockedAt)
                                .findFirst()
                                .orElse(LocalDateTime.now());
                        return new AchievementDTO.UserAchievementInfo(
                                a.getId(), a.getName(), a.getDescription(), a.getIcon(), unlockedAt);
                    })
                    .collect(Collectors.toList());
        }

        return unlocked.stream()
                .map(ua -> new AchievementDTO.UserAchievementInfo(
                        ua.getAchievement().getId(),
                        ua.getAchievement().getName(),
                        ua.getAchievement().getDescription(),
                        ua.getAchievement().getIcon(),
                        ua.getUnlockedAt()))
                .collect(Collectors.toList());
    }
}
