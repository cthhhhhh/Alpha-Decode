package com.csd.cs203t1.user;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.csd.cs203t1.achievement.Achievement;
import com.csd.cs203t1.achievement.AchievementService;
import com.csd.cs203t1.achievement.UserAchievementRepository;
import com.csd.cs203t1.bookmark.UserBookmarkRepository;
import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.draft.DraftRepository;
import com.csd.cs203t1.flag.FlagRepository;
import com.csd.cs203t1.security.JwtUtil;
import com.csd.cs203t1.shop.Item;
import com.csd.cs203t1.shop.ItemRepository;
import com.csd.cs203t1.shop.UserItem;
import com.csd.cs203t1.shop.UserItemRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AchievementService achievementService;
    private final UserAchievementRepository userAchievementRepository;
    private final UserBookmarkRepository userBookmarkRepository;
    private final FlagRepository flagRepository;
    private final ItemRepository itemRepository;
    private final UserItemRepository userItemRepository;
    private final DraftRepository draftRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil, AchievementService achievementService,
                           UserAchievementRepository userAchievementRepository,
                           UserBookmarkRepository userBookmarkRepository,
                           FlagRepository flagRepository,
                           ItemRepository itemRepository,
                           UserItemRepository userItemRepository,
                           DraftRepository draftRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.achievementService = achievementService;
        this.userAchievementRepository = userAchievementRepository;
        this.userBookmarkRepository = userBookmarkRepository;
        this.flagRepository = flagRepository;
        this.itemRepository = itemRepository;
        this.userItemRepository = userItemRepository;
        this.draftRepository = draftRepository;
    }

    /**
     * Ensures totalCoinsCollected is properly initialized.
     * For existing users, sets totalCoinsCollected to current coins if it was 0.
     * This handles migration from old schema that didn't have these fields.
     */
    private void ensureTotalCoinsInitialized(User user) {
        if (user.getTotalCoinsCollected() == 0 && user.getCoins() > 0) {
            user.setTotalCoinsCollected(user.getCoins());
        }
        if (user.getWeeklyCoinsCollected() == 0 && user.getWeeklyCoins() > 0) {
            user.setWeeklyCoinsCollected(user.getWeeklyCoins());
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
        if (request.getCoins() != null) {
            user.setCoins(request.getCoins());
            user.setWeeklyCoins(request.getCoins());
            user.setTotalCoinsCollected(request.getCoins());
            user.setWeeklyCoinsCollected(request.getCoins());
        }
        if (request.getMaxUnlockedLessonIndex() != null) user.setMaxUnlockedLessonIndex(request.getMaxUnlockedLessonIndex());

        checkStreakLapse(user);
        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser);
        return toAuthResponse(savedUser, token, null);
    }

    @Override
    public void registerContributor(UserDTO.RegisterRequest request) {
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
        user.setRole(Role.CONTRIBUTOR);
        user.setEnabled(false);
        user.setPendingApproval(true);

        userRepository.save(user);
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
        if (request.getCoins() != null) {
            user.setCoins(request.getCoins());
            user.setWeeklyCoins(request.getCoins());
            user.setTotalCoinsCollected(request.getCoins());
            user.setWeeklyCoinsCollected(request.getCoins());
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

        if (!user.isEnabled()) {
            if (user.getRole() == Role.CONTRIBUTOR) {
                throw new IllegalArgumentException("Your contributor account is pending admin approval.");
            }
            throw new IllegalArgumentException("Account is disabled. Please contact admin.");
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
    public UserDTO.AuthResponse updateCoins(UserDTO.CoinUpdateRequest request) {
        User user = getCurrentUser(); // checkStreakLapse called inside getCurrentUser
        ensureTotalCoinsInitialized(user); // Ensure totals are initialized for existing users
        user.setCoins(user.getCoins() + request.getCoinsToAdd());
        user.setWeeklyCoins(user.getWeeklyCoins() + request.getCoinsToAdd());
        user.setTotalCoinsCollected(user.getTotalCoinsCollected() + request.getCoinsToAdd());
        user.setWeeklyCoinsCollected(user.getWeeklyCoinsCollected() + request.getCoinsToAdd());
        int newLevel = user.getCoins() / 50 + 1;
        user.setLevel(newLevel);

        if (request.getMaxUnlockedLessonIndex() != null
                && request.getMaxUnlockedLessonIndex() > user.getMaxUnlockedLessonIndex()) {
            user.setMaxUnlockedLessonIndex(request.getMaxUnlockedLessonIndex());
        }
        Integer streakToSet = request.getStreakToSet();
        if (streakToSet != null && streakToSet > user.getStreak()) {
            user.setStreak(streakToSet);
        }
        if (request.isDailyQuizCountIncrement()) {
            if (user.getDailyQuizLastDate() != null && user.getDailyQuizLastDate().equals(LocalDate.now())) {
                throw new IllegalArgumentException("Daily quiz already completed today");
            }
            user.setDailyQuizCount(user.getDailyQuizCount() + 1);
            user.setDailyQuizLastDate(LocalDate.now());
        }
        if (request.getCompletedRevisionQuizId() != null) {
            String currentIds = user.getCompletedRevisionQuizIds();
            String newId = request.getCompletedRevisionQuizId().toString();
            if (currentIds == null || currentIds.isEmpty()) {
                user.setCompletedRevisionQuizIds(newId);
            } else if (!java.util.Arrays.asList(currentIds.split(",")).contains(newId)) {
                user.setCompletedRevisionQuizIds(currentIds + "," + newId);
            }
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
        // This endpoint isn't usually used for quizzes, but for completeness:
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
        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser);
        return toAuthResponse(savedUser, token, null);
    }

    @Override
    @Transactional
    public void deleteCurrentUser() {
        User user = getCurrentUser();
        // Clean up related data
        draftRepository.deleteByContributorId(user.getId());
        userAchievementRepository.deleteByUser(user);
        userBookmarkRepository.deleteByUser(user);
        flagRepository.deleteByReportedBy(user);
        userItemRepository.deleteByUser(user);

        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void deleteUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        // Clean up related data
        draftRepository.deleteByContributorId(id);
        userAchievementRepository.deleteByUser(user);
        userBookmarkRepository.deleteByUser(user);
        flagRepository.deleteByReportedBy(user);
        userItemRepository.deleteByUser(user);

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

    @Override
    @Transactional
    public UserDTO.AuthResponse completeOnboarding(UserDTO.OnboardingRequest request) {
        User user = getCurrentUser();
        user.setLevel(request.getLevel());
        // Preserve any coins already earned before onboarding
        ensureTotalCoinsInitialized(user);
        int totalCoinsEarned = Math.max(user.getTotalCoinsCollected(), request.getCoins());
        user.setCoins(request.getCoins());
        user.setWeeklyCoins(request.getCoins());
        user.setTotalCoinsCollected(totalCoinsEarned);
        user.setWeeklyCoinsCollected(request.getCoins());
        user.setOnboardingCompleted(true);
        if (request.getFaceId() != null) user.setFaceId(request.getFaceId());
        if (request.getBodyTypeId() != null) user.setBodyTypeId(request.getBodyTypeId());
        if (request.getHairId() != null) user.setHairId(request.getHairId());
        if (request.getSkinColor() != null) user.setSkinColor(request.getSkinColor());
        if (request.getHairColor() != null) user.setHairColor(request.getHairColor());
        User savedUser = userRepository.save(user);

        // Grant starter items
        List<Item> starterItems = itemRepository.findByIsStarterTrue();
        for (Item item : starterItems) {
            if (!userItemRepository.existsByUserAndItem(savedUser, item)) {
                UserItem userItem = new UserItem();
                userItem.setUser(savedUser);
                userItem.setItem(item);
                userItemRepository.save(userItem);
            }
        }

        // Auto-equip starter outfit if none equipped
        if (savedUser.getEquippedOutfitId() == null) {
            starterItems.stream()
                .filter(i -> i.getType() == com.csd.cs203t1.shop.ItemType.OUTFIT)
                .findFirst()
                .ifPresent(i -> {
                    savedUser.setEquippedOutfitId(i.getId());
                    userRepository.save(savedUser);
                });
        }

        return toAuthResponse(savedUser, null, null);
    }
    
    @Override
    @Transactional
    public UserDTO.AuthResponse requestContributorStatus() {
        User user = getCurrentUser();
        // Prevent re-requesting if already pending or if they are already elevated
        if (user.isPendingApproval() || user.getRole() == com.csd.cs203t1.common.Role.CONTRIBUTOR || user.getRole() == com.csd.cs203t1.common.Role.ADMIN) {
            throw new IllegalArgumentException("Invalid state for contributor request.");
        }
        user.setPendingApproval(true);
        User savedUser = userRepository.save(user);
        return toAuthResponse(savedUser, generateToken(savedUser), null);
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
        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                .disabled(!user.isEnabled())
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
                user.getCoins(),
                user.getMaxUnlockedLessonIndex(),
                user.getStreak(),
                lastDate,
                completedToday,
                user.isOnboardingCompleted(),
                user.getCompletedRevisionQuizIds(),
                achievements != null && !achievements.isEmpty() ? achievements : null,
                user.getFaceId(),
                user.getBodyTypeId(),
                user.getHairId(),
                user.getSkinColor(),
                user.getHairColor(),
                user.getEquippedOutfitId(),
                user.getEquippedPetId(),
                user.isPendingApproval()
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
        java.util.Objects.requireNonNull(id, "ID must not be null");
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setCoins(0);
        user.setWeeklyCoins(0);
        // Do NOT reset totalCoinsCollected or weeklyCoinsCollected - these track historical data
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
        java.util.Objects.requireNonNull(id, "ID must not be null");
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(enabled);
        user.setPendingApproval(false);
        userRepository.save(user);
    }
}
