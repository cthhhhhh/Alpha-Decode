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
        // Users get the entire next day to complete the quiz.
        // If today is Tuesday 00:00 AM, if they haven't completed it since Sunday
        // (i.e. before yesterday, Monday), their streak resets.
        List<User> toReset = userRepository.findByStreakGreaterThanAndDailyQuizLastDateBefore(
                0, LocalDate.now().minusDays(1));
        toReset.forEach(u -> u.setStreak(0));
        userRepository.saveAll(toReset);
    }
}
