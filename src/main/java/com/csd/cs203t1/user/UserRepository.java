package com.csd.cs203t1.user;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.csd.cs203t1.common.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    long countByRole(Role role);

    List<User> findByRoleAndEnabled(Role role, boolean enabled);

    Page<User> findAllByRoleNotOrderByCoinsDescLevelDesc(Role role, Pageable pageable);

    Page<User> findAllByRoleNotOrderByWeeklyCoinsDescLevelDesc(Role role, Pageable pageable);

    Page<User> findByRoleNotAndDailyQuizLastDateGreaterThanEqualOrderByCoinsDescLevelDesc(Role role, LocalDate since, Pageable pageable);

    Page<User> findAllByRoleNotOrderByLevelDescCoinsDesc(Role role, Pageable pageable);

    Page<User> findAllByRoleNotOrderByStreakDescCoinsDesc(Role role, Pageable pageable);

    long countByRoleNotAndCoinsGreaterThan(Role role, int coins);

    long countByRoleNotAndWeeklyCoinsGreaterThan(Role role, int weeklyCoins);

    long countByRoleNotAndLevelGreaterThan(Role role, int level);

    long countByRoleNotAndLevelAndCoinsGreaterThan(Role role, int level, int coins);

    long countByRoleNotAndStreakGreaterThan(Role role, int streak);

    long countByRoleNotAndStreakAndCoinsGreaterThan(Role role, int streak, int coins);

    long countByRoleNotAndStreakAndWeeklyCoinsGreaterThan(Role role, int streak, int weeklyCoins);

    Page<User> findAllByOrderByCoinsDescLevelDesc(Pageable pageable);

    List<User> findByStreakGreaterThanAndDailyQuizLastDateBefore(int streak, LocalDate date);

    Page<User> findByDailyQuizLastDateGreaterThanEqualOrderByCoinsDescLevelDesc(LocalDate since, Pageable pageable);

    Page<User> findAllByOrderByStreakDescCoinsDesc(Pageable pageable);

    long countByCoinsGreaterThan(int coins);

    long countByStreakGreaterThan(int streak);

    long countByStreakAndCoinsGreaterThan(int streak, int coins);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.weeklyCoins = 0")
    void resetAllWeeklyCoins();
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.onboardingCompleted = true WHERE u.level > 1 OR u.coins > 0 OR u.onboardingCompleted = true")
    void markExistingUsersAsOnboarded();
}
