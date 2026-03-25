package com.csd.cs203t1.user;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.csd.cs203t1.common.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    long countByRole(Role role);

    Page<User> findAllByOrderByXpDescLevelDesc(Pageable pageable);

    List<User> findByStreakGreaterThanAndDailyQuizLastDateBefore(int streak, LocalDate date);

    Page<User> findByDailyQuizLastDateGreaterThanEqualOrderByXpDescLevelDesc(LocalDate since, Pageable pageable);

    Page<User> findAllByOrderByStreakDescXpDesc(Pageable pageable);

    long countByXpGreaterThan(int xp);

    long countByStreakGreaterThan(int streak);
}
