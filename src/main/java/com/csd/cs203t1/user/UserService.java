package com.csd.cs203t1.user;

public interface UserService {
    UserDTO.AuthResponse register(UserDTO.RegisterRequest request);
    UserDTO.AuthResponse registerAdmin(UserDTO.RegisterRequest request);
    UserDTO.AuthResponse login(UserDTO.LoginRequest request);
    User getCurrentUser();
    UserDTO.AuthResponse updateXp(int xpToAdd);
    UserDTO.AuthResponse updateLessonProgress(int maxUnlockedLessonIndex);
}
