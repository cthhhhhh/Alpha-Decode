package com.csd.cs203t1.user;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class StreakScheduler {

    private final UserRepository userRepository;

    public StreakScheduler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void resetMissedStreaks() {
        List<User> toReset = userRepository.findByStreakGreaterThanAndDailyQuizLastDateBefore(
                0, LocalDate.now().minusDays(1));
        toReset.forEach(u -> u.setStreak(0));
        userRepository.saveAll(toReset);
    }

    @Scheduled(cron = "0 0 0 * * SUN")
    public void resetWeeklyXp() {
        // Fires every Sunday at exactly 00:00 (midnight) to wipe the weekly leaderboard tracker
        userRepository.resetAllWeeklyXp();
    }
}
