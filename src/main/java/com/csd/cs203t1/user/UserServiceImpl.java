package com.csd.cs203t1.user;

import com.csd.cs203t1.achievement.Achievement;
import com.csd.cs203t1.achievement.AchievementService;
import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.csd.cs203t1.achievement.UserAchievementRepository;
import com.csd.cs203t1.bookmark.UserBookmarkRepository;
import com.csd.cs203t1.flag.FlagRepository;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AchievementService achievementService;
    private final UserAchievementRepository userAchievementRepository;
    private final UserBookmarkRepository userBookmarkRepository;
    private final FlagRepository flagRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil, AchievementService achievementService,
                           UserAchievementRepository userAchievementRepository,
                           UserBookmarkRepository userBookmarkRepository,
                           FlagRepository flagRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.achievementService = achievementService;
        this.userAchievementRepository = userAchievementRepository;
        this.userBookmarkRepository = userBookmarkRepository;
        this.flagRepository = flagRepository;
    }

    @PostConstruct
    public void init() {
        try {
            userRepository.migrateLegacyQuizDates();
        } catch (Exception e) {
            // Likely column doesn't exist or already migrated
            System.out.println("Legacy quiz date migration skipped: " + e.getMessage());
        }
    }

    @Override
    public UserDTO.AuthResponse register(UserDTO.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        if (request.getLevel() != null) user.setLevel(request.getLevel());
        if (request.getXp() != null) {
            user.setXp(request.getXp());
            user.setWeeklyXp(request.getXp());
        }
        if (request.getMaxUnlockedLessonIndex() != null) user.setMaxUnlockedLessonIndex(request.getMaxUnlockedLessonIndex());

        checkStreakLapse(user);
        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser);
        return toAuthResponse(savedUser, token, null);
    }

    @Override
    public UserDTO.AuthResponse registerAdmin(UserDTO.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ADMIN);
        if (request.getLevel() != null) user.setLevel(request.getLevel());
        if (request.getXp() != null) {
            user.setXp(request.getXp());
            user.setWeeklyXp(request.getXp());
        }

        checkStreakLapse(user);
        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser);
        return toAuthResponse(savedUser, token, null);
    }

    @Override
    public UserDTO.AuthResponse login(UserDTO.LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        checkStreakLapse(user);
        userRepository.save(user);

        String token = generateToken(user);
        return toAuthResponse(user, token, null);
    }

    @Override
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        checkStreakLapse(user);
        return userRepository.save(user);
    }

    @Override
    public UserDTO.AuthResponse getMe() {
        User user = getCurrentUser();
        return toAuthResponse(user, null, null);
    }
    @Override
    @Transactional
    public UserDTO.AuthResponse updateXp(UserDTO.XpUpdateRequest request) {
        User user = getCurrentUser(); // checkStreakLapse called inside getCurrentUser
        user.setXp(user.getXp() + request.getXpToAdd());
        user.setWeeklyXp(user.getWeeklyXp() + request.getXpToAdd());
        int newLevel = user.getXp() / 50 + 1;
        user.setLevel(newLevel);

        if (request.getMaxUnlockedLessonIndex() != null
                && request.getMaxUnlockedLessonIndex() > user.getMaxUnlockedLessonIndex()) {
            user.setMaxUnlockedLessonIndex(request.getMaxUnlockedLessonIndex());
        }
        if (request.getStreakToSet() != null) {
            user.setStreak(request.getStreakToSet());
        }
        if (request.isDailyQuizCountIncrement()) {
            user.setDailyQuizCount(user.getDailyQuizCount() + 1);
            user.setDailyQuizLastDate(LocalDate.now());
        }

        User savedUser = userRepository.save(user);
        List<Achievement> newAchievements = achievementService.checkAndUnlock(savedUser);
        List<UserDTO.NewAchievementDTO> notifs = toNotifDTOs(newAchievements);

        String token = generateToken(savedUser);
        return toAuthResponse(savedUser, token, notifs);
    }

    @Override
    @Transactional
    public UserDTO.AuthResponse updateLessonProgress(int maxUnlockedLessonIndex) {
        User user = getCurrentUser(); // checkStreakLapse called inside getCurrentUser
        if (maxUnlockedLessonIndex > user.getMaxUnlockedLessonIndex()) {
            user.setMaxUnlockedLessonIndex(maxUnlockedLessonIndex);
        }
        User savedUser = userRepository.save(user);
        List<Achievement> newAchievements = achievementService.checkAndUnlock(savedUser);
        List<UserDTO.NewAchievementDTO> notifs = toNotifDTOs(newAchievements);

        String token = generateToken(savedUser);
        return toAuthResponse(savedUser, token, notifs);
    }

    @Override
    public UserDTO.AuthResponse updateProfile(UserDTO.UpdateProfileRequest request) {
        User user = getCurrentUser(); // checkStreakLapse called inside getCurrentUser
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            if (!request.getUsername().equals(user.getUsername())
                    && userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username is already taken");
            }
            user.setUsername(request.getUsername());
        }
        if (request.getProfilePic() != null) {
            user.setProfilePic(request.getProfilePic());
        }
        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser);
        return toAuthResponse(savedUser, token, null);
    }

    @Override
    @Transactional
    public void deleteCurrentUser() {
        User user = getCurrentUser();
        // Clean up related data
        userAchievementRepository.deleteByUser(user);
        userBookmarkRepository.deleteByUser(user);
        flagRepository.deleteByReportedBy(user);
        
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void deleteUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        // Clean up related data
        userAchievementRepository.deleteByUser(user);
        userBookmarkRepository.deleteByUser(user);
        flagRepository.deleteByReportedBy(user);
        
        userRepository.delete(user);
    }

    @Override
    public void changePassword(UserDTO.ChangePasswordRequest request) {
        User user = getCurrentUser(); // checkStreakLapse called inside getCurrentUser
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password cannot be the same as the old password");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public boolean verifyUserForReset(UserDTO.VerifyUserRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (user == null) {
            return false;
        }
        return user.getEmail() != null && user.getEmail().equals(request.getEmail());
    }

    @Override
    public void resetPassword(UserDTO.ResetPasswordRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password cannot be the same as the old password");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private void checkStreakLapse(User user) {
        if (user.getDailyQuizLastDate() == null) {
            return;
        }
        LocalDate today = LocalDate.now();
        LocalDate lastDate = user.getDailyQuizLastDate();
        
        if (lastDate.isBefore(today.minusDays(1))) {
            user.setStreak(0);
        }
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private String generateToken(User user) {
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                .build();
        return jwtUtil.generateToken(userDetails);
    }

    private UserDTO.AuthResponse toAuthResponse(User user, String token, List<UserDTO.NewAchievementDTO> achievements) {
        String lastDate = user.getDailyQuizLastDate() != null ? user.getDailyQuizLastDate().toString() : null;
        boolean completedToday = user.getDailyQuizLastDate() != null
                && user.getDailyQuizLastDate().equals(LocalDate.now());
        return new UserDTO.AuthResponse(
                token,
                user.getRole().name(),
                user.getUsername(),
                user.getLevel(),
                user.getXp(),
                user.getMaxUnlockedLessonIndex(),
                user.getStreak(),
                user.getProfilePic(),
                lastDate,
                completedToday,
                achievements != null && !achievements.isEmpty() ? achievements : null
        );
    }

    private List<UserDTO.NewAchievementDTO> toNotifDTOs(List<Achievement> achievements) {
        return achievements.stream()
                .map(a -> new UserDTO.NewAchievementDTO(a.getName(), a.getIcon(), a.getDescription()))
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public void resetProgress(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setXp(0);
        user.setWeeklyXp(0);
        user.setLevel(1);
        user.setStreak(0);
        user.setMaxUnlockedLessonIndex(0);
        user.setDailyQuizCount(0);
        user.setDailyQuizLastDate(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void setUserEnabled(Long id, boolean enabled) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(enabled);
        userRepository.save(user);
    }
}
