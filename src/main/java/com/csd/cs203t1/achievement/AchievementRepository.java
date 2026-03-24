package com.csd.cs203t1.achievement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    boolean existsByName(String name);
    java.util.Optional<Achievement> findByName(String name);
}
