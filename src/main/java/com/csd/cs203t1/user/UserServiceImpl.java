package com.csd.cs203t1.user;

import com.csd.cs203t1.common.Role;
import com.csd.cs203t1.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getUsername())
                .password(savedUser.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name()))
                .build();

        String token = jwtUtil.generateToken(userDetails);
        return new UserDTO.AuthResponse(token, savedUser.getRole().name(), savedUser.getUsername(), savedUser.getLevel(), savedUser.getXp(), savedUser.getMaxUnlockedLessonIndex());
    }

    @Override
    public UserDTO.AuthResponse login(UserDTO.LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                .build();

        String token = jwtUtil.generateToken(userDetails);
        return new UserDTO.AuthResponse(token, user.getRole().name(), user.getUsername(), user.getLevel(), user.getXp(), user.getMaxUnlockedLessonIndex());
    }

    @Override
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public UserDTO.AuthResponse updateXp(int xpToAdd) {
        User user = getCurrentUser();
        user.setXp(user.getXp() + xpToAdd);
        User savedUser = userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getUsername())
                .password(savedUser.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name()))
                .build();

        String token = jwtUtil.generateToken(userDetails);
        return new UserDTO.AuthResponse(token, savedUser.getRole().name(), savedUser.getUsername(), savedUser.getLevel(), savedUser.getXp(), savedUser.getMaxUnlockedLessonIndex());
    }

    @Override
    public UserDTO.AuthResponse updateLessonProgress(int maxUnlockedLessonIndex) {
        User user = getCurrentUser();
        if (maxUnlockedLessonIndex > user.getMaxUnlockedLessonIndex()) {
            user.setMaxUnlockedLessonIndex(maxUnlockedLessonIndex);
        }
        User savedUser = userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getUsername())
                .password(savedUser.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name()))
                .build();

        String token = jwtUtil.generateToken(userDetails);
        return new UserDTO.AuthResponse(token, savedUser.getRole().name(), savedUser.getUsername(), savedUser.getLevel(), savedUser.getXp(), savedUser.getMaxUnlockedLessonIndex());
    }
}
