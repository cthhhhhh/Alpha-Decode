package com.csd.cs203t1.achievement;

import com.csd.cs203t1.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    List<UserAchievement> findByUser(User user);
    boolean existsByUserAndAchievement(User user, Achievement achievement);
    void deleteByUser(User user);
}
