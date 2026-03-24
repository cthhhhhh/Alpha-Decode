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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AchievementService achievementService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil, AchievementService achievementService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.achievementService = achievementService;
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
        if (request.getXp() != null) user.setXp(request.getXp());
        if (request.getMaxUnlockedLessonIndex() != null) user.setMaxUnlockedLessonIndex(request.getMaxUnlockedLessonIndex());

        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser);
        return new UserDTO.AuthResponse(token, savedUser.getRole().name(), savedUser.getUsername(),
                savedUser.getLevel(), savedUser.getXp(), savedUser.getMaxUnlockedLessonIndex(), savedUser.getStreak());
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
        if (request.getXp() != null) user.setXp(request.getXp());

        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser);
        return new UserDTO.AuthResponse(token, savedUser.getRole().name(), savedUser.getUsername(),
                savedUser.getLevel(), savedUser.getXp(), savedUser.getMaxUnlockedLessonIndex(), savedUser.getStreak());
    }

    @Override
    public UserDTO.AuthResponse login(UserDTO.LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String token = generateToken(user);
        return new UserDTO.AuthResponse(token, user.getRole().name(), user.getUsername(),
                user.getLevel(), user.getXp(), user.getMaxUnlockedLessonIndex(), user.getStreak());
    }

    @Override
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public UserDTO.AuthResponse updateXp(UserDTO.XpUpdateRequest request) {
        User user = getCurrentUser();
        user.setXp(user.getXp() + request.getXpToAdd());

        if (request.getMaxUnlockedLessonIndex() != null
                && request.getMaxUnlockedLessonIndex() > user.getMaxUnlockedLessonIndex()) {
            user.setMaxUnlockedLessonIndex(request.getMaxUnlockedLessonIndex());
        }
        if (request.getStreakToSet() != null) {
            user.setStreak(request.getStreakToSet());
        }
        if (request.isDailyQuizCountIncrement()) {
            user.setDailyQuizCount(user.getDailyQuizCount() + 1);
        }

        User savedUser = userRepository.save(user);
        List<Achievement> newAchievements = achievementService.checkAndUnlock(savedUser);
        List<UserDTO.NewAchievementDTO> notifs = toNotifDTOs(newAchievements);

        String token = generateToken(savedUser);
        return new UserDTO.AuthResponse(token, savedUser.getRole().name(), savedUser.getUsername(),
                savedUser.getLevel(), savedUser.getXp(), savedUser.getMaxUnlockedLessonIndex(),
                savedUser.getStreak(), notifs.isEmpty() ? null : notifs);
    }

    @Override
    public UserDTO.AuthResponse updateLessonProgress(int maxUnlockedLessonIndex) {
        User user = getCurrentUser();
        if (maxUnlockedLessonIndex > user.getMaxUnlockedLessonIndex()) {
            user.setMaxUnlockedLessonIndex(maxUnlockedLessonIndex);
        }
        User savedUser = userRepository.save(user);
        List<Achievement> newAchievements = achievementService.checkAndUnlock(savedUser);
        List<UserDTO.NewAchievementDTO> notifs = toNotifDTOs(newAchievements);

        String token = generateToken(savedUser);
        return new UserDTO.AuthResponse(token, savedUser.getRole().name(), savedUser.getUsername(),
                savedUser.getLevel(), savedUser.getXp(), savedUser.getMaxUnlockedLessonIndex(),
                savedUser.getStreak(), notifs.isEmpty() ? null : notifs);
    }

    @Override
    public UserDTO.AuthResponse updateProfile(UserDTO.UpdateProfileRequest request) {
        User user = getCurrentUser();
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            if (!request.getUsername().equals(user.getUsername())
                    && userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username is already taken");
            }
            user.setUsername(request.getUsername());
        }
        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser);
        return new UserDTO.AuthResponse(token, savedUser.getRole().name(), savedUser.getUsername(),
                savedUser.getLevel(), savedUser.getXp(), savedUser.getMaxUnlockedLessonIndex(), savedUser.getStreak());
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

    private List<UserDTO.NewAchievementDTO> toNotifDTOs(List<Achievement> achievements) {
        return achievements.stream()
                .map(a -> new UserDTO.NewAchievementDTO(a.getName(), a.getIcon(), a.getDescription()))
                .collect(Collectors.toList());
    }
}
