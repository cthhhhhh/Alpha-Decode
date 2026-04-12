package com.csd.cs203t1.user;

public interface UserService {
    UserDTO.AuthResponse register(UserDTO.RegisterRequest request);
    UserDTO.AuthResponse registerAdmin(UserDTO.RegisterRequest request);
    void registerContributor(UserDTO.RegisterRequest request);
    UserDTO.AuthResponse login(UserDTO.LoginRequest request);
    User getCurrentUser();
    User getCurrentUserReadOnly();
    UserDTO.AuthResponse getMe();
    UserDTO.AuthResponse updateCoins(UserDTO.CoinUpdateRequest request);
    UserDTO.AuthResponse updateLessonProgress(int maxUnlockedLessonIndex);
    UserDTO.AuthResponse updateProfile(UserDTO.UpdateProfileRequest request);
    void changePassword(UserDTO.ChangePasswordRequest request);
    boolean verifyUserForReset(UserDTO.VerifyUserRequest request);
    void resetPassword(UserDTO.ResetPasswordRequest request);
    void deleteCurrentUser();
    void deleteUserById(Long id);
    void resetProgress(Long id);
    void setUserEnabled(Long id, boolean enabled);
    UserDTO.AuthResponse completeOnboarding(UserDTO.OnboardingRequest request);
    UserDTO.AuthResponse requestContributorStatus();
}
