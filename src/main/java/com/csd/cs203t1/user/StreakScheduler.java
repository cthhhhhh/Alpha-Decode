package com.csd.cs203t1.user;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import com.csd.cs203t1.common.SystemMetadata;
import com.csd.cs203t1.common.SystemMetadataRepository;

@Component
public class StreakScheduler {

    private final UserRepository userRepository;
    private final SystemMetadataRepository systemMetadataRepository;

    public StreakScheduler(UserRepository userRepository, SystemMetadataRepository systemMetadataRepository) {
        this.userRepository = userRepository;
        this.systemMetadataRepository = systemMetadataRepository;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void resetMissedStreaks() {
        List<User> toReset = userRepository.findByStreakGreaterThanAndDailyQuizLastDateBefore(
                0, LocalDate.now().minusDays(1));
        toReset.forEach(u -> u.setStreak(0));
        userRepository.saveAll(toReset);
    }

    @Scheduled(cron = "0 0 0 * * MON")
    public void resetWeeklyCoins() {
        // Fires every Monday at exactly 00:00 (midnight) to wipe the weekly leaderboard tracker
        userRepository.resetAllWeeklyCoins();
        
        // Update metadata
        SystemMetadata metadata = systemMetadataRepository.findByKey("lastWeeklyReset")
            .orElse(new SystemMetadata("lastWeeklyReset", ""));
        metadata.setValue(LocalDate.now().toString());
        systemMetadataRepository.save(metadata);
    }
}
