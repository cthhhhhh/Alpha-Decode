package com.csd.cs203t1.user;

public interface UserService {
    UserDTO.AuthResponse register(UserDTO.RegisterRequest request);
    UserDTO.AuthResponse login(UserDTO.LoginRequest request);
    User getCurrentUser();
}
