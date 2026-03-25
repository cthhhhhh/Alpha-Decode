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

    @Scheduled(cron = "0 5 0 * * *")
    public void resetMissedStreaks() {
        List<User> toReset = userRepository.findByStreakGreaterThanAndDailyQuizLastDateBefore(
                0, LocalDate.now());
        toReset.forEach(u -> u.setStreak(0));
        userRepository.saveAll(toReset);
    }
}
