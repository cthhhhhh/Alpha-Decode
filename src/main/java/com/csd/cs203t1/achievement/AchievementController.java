package com.csd.cs203t1.achievement;

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;
    private final UserService userService;

    public AchievementController(AchievementService achievementService, UserService userService) {
        this.achievementService = achievementService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<AchievementDTO.AchievementInfo>> getAllAchievements() {
        return ResponseEntity.ok(achievementService.getAllAchievements());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyAchievements() {
        try {
            User user = userService.getCurrentUser();
            return ResponseEntity.ok(achievementService.getUserAchievements(user));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }
}
