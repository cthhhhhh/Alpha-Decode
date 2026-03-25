package com.csd.cs203t1.user;

public interface UserService {
    UserDTO.AuthResponse register(UserDTO.RegisterRequest request);
    UserDTO.AuthResponse registerAdmin(UserDTO.RegisterRequest request);
    UserDTO.AuthResponse login(UserDTO.LoginRequest request);
    User getCurrentUser();
    UserDTO.AuthResponse getMe();
    UserDTO.AuthResponse updateXp(UserDTO.XpUpdateRequest request);
    UserDTO.AuthResponse updateLessonProgress(int maxUnlockedLessonIndex);
    UserDTO.AuthResponse updateProfile(UserDTO.UpdateProfileRequest request);
    void changePassword(UserDTO.ChangePasswordRequest request);
    boolean verifyUserForReset(UserDTO.VerifyUserRequest request);
    void resetPassword(UserDTO.ResetPasswordRequest request);
    void deleteCurrentUser();
    void deleteUserById(Long id);
}
