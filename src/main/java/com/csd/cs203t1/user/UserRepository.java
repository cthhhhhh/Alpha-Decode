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

    Page<User> findByRoleNotAndDailyQuizLastDateGreaterThanEqualOrderByXpDescLevelDesc(Role role, LocalDate since, Pageable pageable);

    Page<User> findAllByRoleNotOrderByLevelDescXpDesc(Role role, Pageable pageable);

    Page<User> findAllByRoleNotOrderByStreakDescXpDesc(Role role, Pageable pageable);

    long countByRoleNotAndXpGreaterThan(Role role, int xp);

    long countByRoleNotAndLevelGreaterThan(Role role, int level);

    long countByRoleNotAndLevelAndXpGreaterThan(Role role, int level, int xp);

    long countByRoleNotAndStreakGreaterThan(Role role, int streak);

    long countByRoleNotAndStreakAndXpGreaterThan(Role role, int streak, int xp);

    Page<User> findAllByOrderByXpDescLevelDesc(Pageable pageable);

    List<User> findByStreakGreaterThanAndDailyQuizLastDateBefore(int streak, LocalDate date);

    Page<User> findByDailyQuizLastDateGreaterThanEqualOrderByXpDescLevelDesc(LocalDate since, Pageable pageable);

    Page<User> findAllByOrderByStreakDescXpDesc(Pageable pageable);

    long countByXpGreaterThan(int xp);

    long countByStreakGreaterThan(int streak);

    long countByStreakAndXpGreaterThan(int streak, int xp);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE users " +
                   "SET daily_quiz_last_date = substr(last_daily_quiz_completed_date, 12, 4) || '-' || " +
                   "CASE substr(last_daily_quiz_completed_date, 5, 3) " +
                   "  WHEN 'Jan' THEN '01' WHEN 'Feb' THEN '02' WHEN 'Mar' THEN '03' WHEN 'Apr' THEN '04' " +
                   "  WHEN 'May' THEN '05' WHEN 'Jun' THEN '06' WHEN 'Jul' THEN '07' WHEN 'Aug' THEN '08' " +
                   "  WHEN 'Sep' THEN '09' WHEN 'Oct' THEN '10' WHEN 'Nov' THEN '11' WHEN 'Dec' THEN '12' " +
                   "END || '-' || substr(last_daily_quiz_completed_date, 9, 2) " +
                   "WHERE daily_quiz_last_date IS NULL AND last_daily_quiz_completed_date IS NOT NULL", nativeQuery = true)
    void migrateLegacyQuizDates();
}
