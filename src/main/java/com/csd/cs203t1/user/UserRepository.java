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

    Page<User> findAllByRoleNotOrderByXpDescLevelDesc(Role role, Pageable pageable);

    Page<User> findAllByRoleNotOrderByWeeklyXpDescLevelDesc(Role role, Pageable pageable);

    Page<User> findByRoleNotAndDailyQuizLastDateGreaterThanEqualOrderByXpDescLevelDesc(Role role, LocalDate since, Pageable pageable);

    Page<User> findAllByRoleNotOrderByLevelDescXpDesc(Role role, Pageable pageable);

    Page<User> findAllByRoleNotOrderByStreakDescXpDesc(Role role, Pageable pageable);

    long countByRoleNotAndXpGreaterThan(Role role, int xp);

    long countByRoleNotAndWeeklyXpGreaterThan(Role role, int weeklyXp);

    long countByRoleNotAndLevelGreaterThan(Role role, int level);

    long countByRoleNotAndLevelAndXpGreaterThan(Role role, int level, int xp);

    long countByRoleNotAndStreakGreaterThan(Role role, int streak);

    long countByRoleNotAndStreakAndXpGreaterThan(Role role, int streak, int xp);

    long countByRoleNotAndStreakAndWeeklyXpGreaterThan(Role role, int streak, int weeklyXp);

    Page<User> findAllByOrderByXpDescLevelDesc(Pageable pageable);

    List<User> findByStreakGreaterThanAndDailyQuizLastDateBefore(int streak, LocalDate date);

    Page<User> findByDailyQuizLastDateGreaterThanEqualOrderByXpDescLevelDesc(LocalDate since, Pageable pageable);

    Page<User> findAllByOrderByStreakDescXpDesc(Pageable pageable);

    long countByXpGreaterThan(int xp);

    long countByStreakGreaterThan(int streak);

    long countByStreakAndXpGreaterThan(int streak, int xp);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.weeklyXp = 0")
    void resetAllWeeklyXp();
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.onboardingCompleted = true WHERE u.level > 1 OR u.xp > 0 OR u.onboardingCompleted = true")
    void markExistingUsersAsOnboarded();
}
